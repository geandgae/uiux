"use strict";

const core = (() => {
  // init
  const loadDiv = document.querySelector(".loading");
  let dataJson = [];
  const dataOrign = [];
  let dataClone = []; // dataOrign 필터 상태에 따라 저장
  const at = {
    u_00 : "사용자00", 
    u_01 : "사용자01",
    u_02 : "사용자02",
  }
  const st = {
    fin : "완료",
    mod : "수정",
    del : "삭제",
    wtn : "대기",
    ing : "진행",
  }
  const ctg = {
    ct00: {
      id: "table_00",
      title: "table_00",
    },
    ct01: {
      id: "table_01",
      title: "table_01",
    },
    ct02: {
      id: "table_02",
      title: "table_02",
    },
  };

  // 불러올 JSON 파일 경로 배열
  const jsonFilePaths = [
    // "./assets/js/test_core_json/data_00.json",
    // "./assets/js/test_core_json/data_01.json",
    "./assets/js/test_core_json/data_02.json",
    "./assets/js/test_core_json/data_03.json",
  ];

  // 여러 개의 데이터를 비동기적으로 불러오고 로딩 화면을 표시하는 함수
  const fetchData = async (filePaths) => {
    try {
      // 데이터를 불러오는 중임을 사용자에게 알리기 위해 로딩 화면을 표시합니다.
      displayLoading();

      // json 파일 한개
      // 실제로 데이터를 비동기적으로 불러오는 로직을 작성합니다.
      // const response = await fetch("./assets/js/test_core_json/data_00.json");
      // const data = await response.json();

      // json 파일 n개
      // 각 파일 경로에 대해 fetch 요청을 생성합니다.
      const fetchPromises = filePaths.map((filePath) => fetch(filePath).then((response) => response.json()));
      // 모든 fetch 요청이 완료될 때까지 기다립니다.
      const data = await Promise.all(fetchPromises);

      // 데이터를 성공적으로 불러온 후 로딩 화면을 숨깁니다.
      hideLoading();

      // 불러온 데이터를 하나의 배열로 합칩니다.
      const combinedData = data.flat();

      // 합쳐진 데이터를 반환합니다.
      return combinedData;
      // 불러온 데이터를 반환합니다.
    } catch (error) {
      // 데이터 불러오기 중 오류가 발생한 경우 오류를 콘솔에 기록합니다.
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);

      // 로딩 화면을 숨깁니다.
      hideLoading();

      // 오류 발생 시에는 null을 반환합니다.
      return null;
    }
  };

  // initData
  const initData = async (data, out) => {
    displayLoading();
    await waitTime(0); // 비동기 처리를 위해 setTimeout 사용
    const btnMore = `<button type="button" class="btn" title="더보기"><i></i></button>`
    data.forEach((item) => {
      // date
      const recentDate = calculateDateDifference(item.date);
      // console.log(recentDate);
      // note
      const numNote = item.note.length;
      const hasMultipleNotes = numNote > 1;
      const multiClass = hasMultipleNotes ? "multi" : "";
      let noteRow = [];
      item.note.forEach((note) => {
        noteRow.push(`<p>${note}</p>`);
      });
      const tableRow = `
        <tr data-id="${item.id}" data-sort="${item.date}" class="${recentDate > -6 ? "recent" : ""}">
          <td class="index"><p></p></td>
          <td class="depth1"><p>${item.depth1}</p></td>
          <td class="depth2"><p>${item.depth2}</p></td>
          <td class="depth3"><p>${item.depth3}</p></td>
          <td class="depth4"><p>${item.depth4}</p></td>
          <td class="id"><p>${item.view_id}</p></td>
          <td class="name"><p>${item.view_name}</p></td>
          <td class="url">
            <p>
              <a href="${item.view_url}" target="target">${item.view_url}</a> 
              <a href="${item.view_url}" target="blank" class="icon-link">!!fv!!</a>
            </p>
          </td>
          <td class="date"><p>${item.date}</p></td>
          <td class="state"><p>${item.state.trim() === "" ? "대기" : item.state}</p></td>
          <td class="author"><p>${item.author}</p></td>
          <td class="note ${multiClass}">
            ${multiClass.trim()  === "" ? "" : btnMore}
            <div class="note-memo target">${noteRow.join("")}</div>
          </td>
        </tr>
      `;
      out.push(tableRow);
    });
    hideLoading();
  };

  // initTable : data_options ctg(category)의 개수만큼 article을 생성(빈 테이블 생성)
  const initTable = () => {
    const container = document.querySelector(".contents");
    // 객체를 배열로 전환
    const articles = Object.values(ctg).map((category) => {
      const { id, title } = category;
      return `
        <!-- article -->
        <article class="article" id="${id}">
          <h2>${title}</h2>
          <!-- table -->
          <table class="table">
            <caption>${title}</caption>
            <thead>
              <tr>
                <th class="index">no</th>
                <th class="depth1">depth1</th>
                <th class="depth2">depth2</th>
                <th class="depth3">depth3</th>
                <th class="depth4">depth4</th>
                <th class="id">id</th>
                <th class="name">name</th>
                <th class="url">url</th>
                <th class="date">date</th>
                <th class="state">state</th>
                <th class="author">author</th>
                <th class="note">note</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <!-- //table -->
        </article>
        <!-- //article -->
      `;
    });
    container.innerHTML = articles.join("");
  };

  // renderTable : initTable에서 생성한 article에 dataOrign을 뿌림(테이블 실제 데이터 생성)
  const renderTable = async (data) => {
    displayLoading();
    const article = document.querySelectorAll(".article");
    await waitTime(0); // 비동기 처리를 위해 setTimeout 사용
    article.forEach((item) => {
      const id = item.getAttribute("id");
      const tableBody = item.querySelector("tbody");
      const filteredData = filterData(data, id);
      tableBody.innerHTML = filteredData.join("");
      // tableBody.innerHTML = data.join("");
      // console.log(filteredData);
    });
    hideLoading();
    attachEventListeners();
  };

  // utils
  // initFilter : 필터 옵션 실행
  const initFilter = () => {
    initAuthorOptions();
    initStateOptions();
    initCategoryButtons();
    categoryFilter();
    initSelectFilter();
  };

  // initAuthorOptions : 작성자 옵션 초기화
  const initAuthorOptions = () => {
    const authorSelect = document.querySelector(".filter select[name=author]");
    const authorOptions = [`<option value="">author</option>`];
    for (const item in at) {
      authorOptions.push(`<option value="${at[item]}">${at[item]}</option>`);
    }
    authorSelect.innerHTML = authorOptions.join("");
  };

  // initStateOptions : 상태값 옵션 초기화
  const initStateOptions = () => {
    const stateSelect = document.querySelector(".filter select[name=state]");
    const StateOptions = [`<option value="">state</option>`];
    for (const item in st) {
      StateOptions.push(`
        <option value="${st[item]}">${st[item]}</option>
      `);
    }
    stateSelect.innerHTML = StateOptions.join("");
  };

  // initCategoryButtons : 카테고리 초기화
  const initCategoryButtons = () => {
    const categoryContainer = document.querySelector(".category");
    const categorybuttons = [`<li><button type="button" class="btn" id="table_all">전체보기</button></li>`];
    for (const item in ctg) {
      const id = ctg[item].id;
      const title = ctg[item].title;
      categorybuttons.push(`<li><button type="button" class="btn" id="${id}">${title}</button></li>`);
    }
    if (categoryContainer) {
      categoryContainer.innerHTML = categorybuttons.join("");
    }
  };

  // categoryFilter : 카테고리 필터
  const categoryFilter = () => {
    const categoryButtons = document.querySelectorAll(".category .btn");
    const articles = document.querySelectorAll(".article");

    const filterByCategory = async (event) => {
      displayLoading();
      const categoryId = event.currentTarget.id;
      await waitTime(500); // 비동기 처리를 위해 setTimeout 사용
      articles.forEach((item) => {
        item.classList.add("hide");
        if (categoryId === item.id || categoryId === "table_all") {
          item.classList.remove("hide");
        }
      });
      hideLoading();

      // 검색초기화
      const selects = document.querySelectorAll(".filter select");
      const input = document.querySelector(".filter input[type=text]");
      input.value = "";
      selects.forEach((item) => {
        item.selectedIndex = 0;
      });
      dataClone = filterData(dataOrign, "");
      renderTable(dataClone);

    };

    categoryButtons.forEach((item) => {
      item.addEventListener("click", filterByCategory);
    });
  };

  // initSelectFilter : 선택필터 초기화
  const initSelectFilter = () => {
    const selectAuthor = document.querySelector(".filter select[name=author]");
    const selectState = document.querySelector(".filter select[name=state]");
    const input = document.querySelector(".filter input[type=text]");

    const updateFilteredData = () => {
      const selectedAuthor = selectAuthor.value;
      const selectedState = selectState.value;
      const keyword = input.value;
      dataClone = filterData(dataOrign, selectedAuthor, selectedState, keyword);
      renderTable(dataClone);
    };

    selectAuthor.addEventListener("change", updateFilteredData);
    selectState.addEventListener("change", updateFilteredData);
    input.addEventListener("keyup", updateFilteredData);

    // const filterBySelect = () => {
    //   const keyword = input.value;
    //   dataClone = filterData(dataOrign, keyword);
    //   // renderTable : 테이블을 dataClone으로 다시 그림
    //   renderTable(dataClone);
    //   // dataClone 테이블을 렌더링한 후 이벤트 리스너 다시 설정
    // };

    // 검색 입력값 실행
    // input.addEventListener("keyup", () => {
    //   filterBySelect();
    // });
  };

  // updateTableIndex : 전체개수
  const updateTableIndex = () => {
    const cells = document.querySelectorAll(".table td.index > p");
    const counter = document.querySelector(".counter");
    const length = cells.length;

    // 전체 글 개수
    if (counter) {
      counter.innerHTML = `총 ${length} 개`;
    }

    // 글번호
    cells.forEach((item, index) => {
      const number = index + 1;
      item.textContent = number;
    });
  };

  // updateTableProgress : 진행상태 개수
  const updateTableProgress = () => {
    const rows = document.querySelectorAll(".table tbody tr .state p");
    const totalRows = rows.length;
    const states = {
      fin: st.fin,
      mod: st.mod,
      del: st.del,
      wtn: st.wtn,
      chk: st.chk,
      ing: st.ing,
    };
    const stateCounts = {
      fin: 0,
      mod: 0,
      del: 0,
      wtn: 0,
      chk: 0,
      ing: 0,
    };

    // 상태별로 클래스를 추가하고 개수를 증가시키는 함수
    rows.forEach((item) => {
      const stateText = item.textContent;
      if (stateText === states.fin) {
        item.classList.add("fin");
        stateCounts.fin++;
      } else if (stateText === states.mod) {
        item.classList.add("mod");
        stateCounts.mod++;
      } else if (stateText === states.del) {
        item.classList.add("del");
        stateCounts.del++;
      } else if (stateText === states.wtn || stateText.trim() === "") {
        item.classList.add("wtn");
        stateCounts.wtn++;
      } else if (stateText === states.ing) {
        item.classList.add("ing");
        stateCounts.ing++;
      }
    });

    // 진행상태 퍼센트 계산
    const totalPercentage = totalRows > 0 ? Math.round((stateCounts.fin / totalRows) * 100) : 0;
    const progress = document.querySelector(".progress");
    const progressHTML = `
      <ul class="progress-info">
        <li>전체 : ${totalRows}</li>
        <li>${states.fin} : ${stateCounts.fin}</li>
        <li>${states.mod} : ${stateCounts.mod}</li>
        <li>${states.del} : ${stateCounts.del}</li>
        <li>${states.wtn} : ${stateCounts.wtn}</li>
        <li>${states.chk} : ${stateCounts.chk}</li>
        <li>${states.ing} : ${stateCounts.ing}</li>
      </ul>
      <div class="progress-bar">
        <div class="text">${totalPercentage}%</div>  
        <div class="bar">
          <span role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${totalPercentage}" style="width:${totalPercentage}%"></span>
        </div>  
      </div>  
    `;
    progress.innerHTML = progressHTML;
  };

  // copyTableContent : 테이블 내용을 복사하는 함수
  const copyTableContent = () => {
    // 클립보드에 텍스트를 복사하는 함수
    const copyTextToClipboard = async (element) => {
      try {
        // 대상 요소의 텍스트 내용을 클립보드에 복사 시도
        await navigator.clipboard.writeText(element.textContent);
        // tr 복사할때 한줄처리
        // await navigator.clipboard.writeText(element.textContent.replace(/\r?\n|\r/g, ' '));

        // 복사 성공 메시지와 복사된 내용을 콘솔에 출력
        console.log("복사 완료");
        console.log(element.textContent);

        // 복사된 내용을 변수에 저장
        const copyContent = element.textContent;

        // 복사된 내용으로 토스트 팝업 호출 (setToast 함수가 정의되어 있어야 합니다)
        setToast(copyContent);
      } catch (error) {
        // 복사 실패 메시지와 시도한 내용을 콘솔에 출력
        console.log("복사 실패");
        console.log(element.textContent);

        // 에러 메시지를 콘솔에 출력
        console.error(error);
      }
    };

    // 모든 .table td p 요소를 선택
    const elements = document.querySelectorAll(".contents .table td p");
    // tr 선택
    // const elements = document.querySelectorAll(".contents .table tbody tr");

    // 각 요소에 클릭 이벤트 리스너를 추가
    elements.forEach((item) => {
      item.addEventListener("click", () => {
        copyTextToClipboard(item)
      });
    });
  };

  // toggleNoteExpansion : 노트 토글 기능
  const toggleNoteExpansion = () => {
    const notes = document.querySelectorAll(".note.multi");
    notes.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("active");
      });
    });
  };

  // toggleRowSelection : 테이블 열 선택
  const toggleRowSelection = () => {
    const toggleSelection = (element) => {
      element.classList.toggle("select");
    };

    const tableRows = document.querySelectorAll(".table tbody tr");
    tableRows.forEach((item) => {
      item.addEventListener("click", () => {
        toggleSelection(item);
      });
    });
  };

  // 내부함수
  // 비동기 처리 setTimeout
  const waitTime = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

  // filterData : renderTable, selectFilter 사용
  // const filterData = (data, query) => {
  //   return data.filter((i) => i.toLowerCase().indexOf(query.toLowerCase()) > -1);
  // };
  // const filterData = (data, query1, query2 = null) => {
  //   // 두 번째 쿼리가 제공되지 않은 경우 첫 번째 쿼리만 사용
  //   if (query2 === null) {
  //     return data.filter((i) => i.toLowerCase().indexOf(query1.toLowerCase()) > -1);
  //   } else {
  //     return data.filter((i) => {
  //       const lowerCaseItem = i.toLowerCase();
  //       // const matchesAuthor = authorQuery === '' || item.author.toLowerCase().includes(authorQuery.toLowerCase());
  //       // const matchesState = stateQuery === '' || item.state.toLowerCase().includes(stateQuery.toLowerCase());
  //       // return matchesAuthor && matchesState;
  //       return (
  //         lowerCaseItem.indexOf(query1.toLowerCase()) > -1 &&
  //         lowerCaseItem.indexOf(query2.toLowerCase()) > -1 
  //       );
  //     });
  //   }
  // };
  const filterData = (data, query1, query2 = "", query3 = "") => {
    return data.filter((i) => {
      const lowerCaseItem = i.toLowerCase();
      return (
        lowerCaseItem.indexOf(query1.toLowerCase()) > -1 &&
        lowerCaseItem.indexOf(query2.toLowerCase()) > -1 &&
        lowerCaseItem.indexOf(query3.toLowerCase()) > -1
      );
    });
  };

  // calculateDateDifference
  const calculateDateDifference = (inputDate) => {
    // 현재 날짜를 얻습니다.
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    // 입력한 날짜를 파싱합니다.
    const input = new Date(inputDate);
    // 날짜 차이를 계산합니다.
    const timeDifference = input.getTime() - today.getTime();
    // 차이를 일 단위로 변환합니다.
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference;
  }

  // setToast : 토스트 메시지를 표시하는 함수
  const setToast = (target) => {
    const outland = document.querySelector("#outland");
    const toast = `
      <div class="toast">
        <div class="inner">
          <p class="text">
            <span class="var">"<em>${target}</em>"</span>
            <span>복사되었습니다.</span>
          </p>
        </div>
      </div>
    `;
    outland.innerHTML = toast;
    setTimeout(() => {
      outland.innerHTML = "";
    }, 1000);
  };


  // 로딩 화면 표시 상태 변수
  let isLoading = false;

  // 로딩 화면을 표시하는 함수
  const displayLoading = () => {
    // 이미 로딩 중인 경우 중복으로 로딩 화면을 표시하지 않도록 합니다.
    if (isLoading) {
      return;
    }
    isLoading = true;
    console.log("isLoading = true; / 로딩중");
    loadDiv.classList.add("active");
    // const loadingSpinner = document.createElement("div");
    // loadingSpinner.classList.add("loading-spinner");
  };

  // 로딩 화면을 숨기는 함수
  const hideLoading = () => {
    isLoading = false;
    console.log("isLoading = false; / 로딩완료");
    loadDiv.classList.remove("active");
    // const loadingSpinner = document.querySelector(".loading-spinner");
    // if (loadingSpinner) {
    //   loadingSpinner.remove();
    // }
  };

  // attachEventListeners : 이벤트 리스너를 필터된 테이블(dataClone)에 다시 바인딩
  const attachEventListeners = () => {
    updateTableIndex();
    updateTableProgress();
    copyTableContent();
    toggleNoteExpansion();
    toggleRowSelection();
  };


  // publicFunction
  const publicFunction = async () => {
    console.log("Public function called");
    // fetchData 함수를 호출하여 데이터를 비동기적으로 불러오고 로딩 화면을 표시합니다.
    await fetchData(jsonFilePaths)
      .then((data) => {
        // 데이터가 성공적으로 불러와졌을 때 수행할 작업을 여기에 작성합니다.
        console.log("데이터를 성공적으로 불러왔습니다:");
        dataJson = data;
      })
      .catch((error) => {
        // 데이터 불러오기 중 오류가 발생했을 때 수행할 작업을 여기에 작성합니다.
        console.error("데이터 불러오기 중 오류가 발생했습니다:", error);
      });
    await initData(dataJson, dataOrign);
    initTable();
    await renderTable(dataOrign);
    // utils
    initFilter();
  };

  // 외부로 함수 return
  return {
    publicFunction: publicFunction,
  };
})();

core.publicFunction();