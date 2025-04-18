import scss from '@scss/default.scss'

"use strict";

// Import
import { at, st, ctg } from "./data_options.js";
import { dataArray } from "./data_set.js";

// 테이블세팅 자동화 data_option 변수 처리
// 정렬
// json 로컬 저장
// 인클루드
// 다크모드
// ia 디자인
// core
// 코드정리 init, 실행부 분리
// 접근성 분리
// 제이슨 방식

// 팝업 1.딤체크 / 2.딤에따른 분기 / 3.팝업의 현재 z-index / 4.팝업종류

// 검색속도 개선

// todo
// 변경할 점 data_options 변수 변경 ctg(카테고리) > initFilter, initTable / author(사용자) > 필터사용 / st(진행상태) > 상태별 개수
// 상태값 : 진행/ing   보류/삭제/del     대기/검수/wait/chk     완료/수정/fin
// 메모 방식 변경... 레이어나 툴팁형태 !!

// Core module
const core = (() => {
  // Global variables
  const loadDiv = document.querySelector(".loading");
  const dataOrign = []; // dataArray 저장
  let dataClone = []; // dataOrign 필터 상태에 따라 저장
  // let dataSort = []; // 정렬용 데이터

  // initData : dataArray의 데이터를 테이블 형식으로 변환해서 dataOrign 배열에 저장
  const initData = (data, out) => {
    const btnMore = `<button type="button" class="btn" title="더보기"><i class="mat-icon-assignmentAdd"></i></button>`;
    data.forEach((item) => {
      // date
      const recentDate = calculateDateDifference(item.date);
      // console.log(recentDate);
      // note
      // const pTags = item.note.match(/<p>/g) || [];
      // const numPTags = pTags.length;
      // const hasMultipleNotes = item.note.match(/<p>/g).length > 1;
      // const hasMultipleNotes = numPTags > 1;
      // const multiClass = hasMultipleNotes ? "multi" : "";
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
            </p>
          </td>
          <td class="date"><p>${item.date}</p></td>
          <td class="state"><p>${item.state.trim() === "" ? "대기" : item.state}</p></td>
          <td class="author"><p>${item.author}</p></td>
          <td class="note ${multiClass}">
            ${multiClass.trim() === "" ? "" : btnMore}
            <div class="note-memo target">${noteRow.join("")}</div>
          </td>
        </tr>
        `;
        out.push(tableRow);
      });
    };

  // initTable : data_options ctg(category)의 개수만큼 article을 생성(빈 테이블 생성)
  const initTable = () => {
    const container = document.querySelector(".contents");
    // const articles = ctg.map(category => {}) 배열형태
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
                <th class="date">
                  date
                  <button class="sortasc">▲</button>
                  <button class="sortdesc">▼</button>
                </th>
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
    await waitTime(500); // 비동기 처리를 위해 setTimeout 사용
    article.forEach((item) => {
      const id = item.getAttribute("id");
      const tableBody = item.querySelector("tbody");
      const filteredData = filterData(data, id);
      tableBody.innerHTML = filteredData.join("");
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
    const categorybuttons = [`<li><button type="button" class="btn active" id="table_all">전체보기</button></li>`];
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
    const tableAllBtn = document.querySelector(".category #table_all");

    // 활성화된 버튼에 active 클래스 추가하는 함수
    const activateButton = (selectedButton) => {
      if (selectedButton && selectedButton.classList) {
        categoryButtons.forEach((button) => {
          button.classList.remove("active");
        });
        // bong 추가
        if(selectedButton.classList.contains("sideBtn")) {
          categoryButtons.forEach((button) => {
            button.classList.remove("active");
          });
          tableAllBtn.classList.add("active");
        } else {
          selectedButton.classList.add("active");
        }
      }
    };

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

      // 클릭된 버튼을 활성화 상태로 변경
      activateButton(event.target);
    };
    
    categoryButtons.forEach((item) => {
      item.addEventListener("click", filterByCategory);
    });
    
    //bong 추가
    const sidebtn = document.querySelector(".sidebar-button .btn");
    sidebtn.addEventListener("click", filterByCategory);
  };

  // initSelectFilter : 선택필터 초기화
  const initSelectFilter = () => {
    const selectAuthor = document.querySelector(".filter select[name=author]");
    const selectState = document.querySelector(".filter select[name=state]");
    const input = document.querySelector(".filter input#keyword");

    const updateFilteredData = () => {
      const selectedAuthor = selectAuthor.value;
      const selectedState = selectState.value;
      const keyword = input.value;
      dataClone = filterData(dataOrign, selectedAuthor, selectedState, keyword);
      renderTable(dataClone);
    };

    if (selectAuthor && selectState && input) {
      // 요소가 존재할 때만 이벤트 리스너를 등록합니다.
      selectAuthor.addEventListener("change", updateFilteredData);
      selectState.addEventListener("change", updateFilteredData);
      input.addEventListener("keyup", updateFilteredData);
    } else {
      console.error("One or more elements not found.");
    }
  };

  // updateTableIndex : 전체개수
  const updateTableIndex = () => {
    const cells = document.querySelectorAll(".table td.index > p");
    const counter = document.querySelector(".counter");
    const length = cells.length;

    // 전체 글 개수
    if (counter) {
      // bong 추가
      // get today
      let date = new Date();
      let year = date.getFullYear();
      let month = ("0" + (1 + date.getMonth())).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      const totalDate = year + "-" + month + "-" + day;
      console.log(totalDate);
      counter.innerHTML = `Total ${length} <p>${totalDate}</p>`;
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
      } else if (stateText === states.chk) {
        item.classList.add("chk");
        stateCounts.chk++;
      } else if (stateText === states.ing) {
        item.classList.add("ing");
        stateCounts.ing++;
      }
    });

    // 진행상태 퍼센트 계산
    // bond barTextPosition 추가함
    const totalPercentage = totalRows > 0 ? Math.round((stateCounts.fin / totalRows) * 100) : 0;
    const progress = document.querySelector(".progress");
    const barTextPosition = totalPercentage > 8 ? (totalPercentage / 2 - 7) : 0;
    // <li>전체 : ${totalRows}</li>
    const progressHTML = `
      <div class="progress-bar">
        <div class="bar">
          <div class="text" style="left:${barTextPosition}%">${totalPercentage}%</div>  
          <span role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${totalPercentage}" style="width:${totalPercentage}%"></span>
        </div>  
      </div> 
      <ul class="progress-info">
        <div class="progress-wrap">
          <li class="fin">${states.fin} : ${stateCounts.fin}</li>
          <li class="mod">${states.mod} : ${stateCounts.mod}</li>
          <li class="del">${states.del} : ${stateCounts.del}</li>
        </div>
        <div class="progress-wrap">
          <li class="wtn">${states.wtn} : ${stateCounts.wtn}</li>
          <li class="chk">${states.chk} : ${stateCounts.chk}</li>
          <li class="ing">${states.ing} : ${stateCounts.ing}</li>
        </div>
      </ul> 
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

    // // ====== old version
    // const toggleEvent = (elements) => {
    //   elements.closest(".note").classList.toggle("active");
    //   elements.classList.toggle("active");
    // };
    // const noteElements = document.querySelectorAll(".table td.note");
    // noteElements.forEach((item) => {
    //   const memos = item.querySelectorAll(".note-memo p");
    //   const toggleButton = item.querySelector(".btn");
    //   if (memos.length > 1) {
    //     item.closest(".note").classList.add("multi");
    //     toggleButton.addEventListener("click", () => toggleEvent(toggleButton));
    //   }
    // });
    // const evt = function(e) {
    //   console.log("noteToggleEvt!!!!! --- evt");
    //   e.currentTarget.closest(".note").classList.toggle("active");
    //   e.currentTarget.classList.toggle("active");
    // };

    // // ====== old version2
    // let note = document.querySelectorAll(".table td.note");
    // note.forEach(function (item) {
    //   console.log(note)
    //   let memo = item.querySelectorAll(".note-memo p");
    //   let btn = item.querySelector(".btn");
    //   if (memo.length > 1) {
    //     item.closest(".note").classList.add("multi");
    //     btn.addEventListener("click", evt);
    //   }
    // });

    // //  ====== IntersectionObserver
    // const tables = document.querySelectorAll(".table");
    // const toggleEvent = (button) => {
    //   const note = button.closest(".note");
    //   note.classList.toggle("active");
    //   button.classList.toggle("active");
    // };
    // const handleIntersection = (entries, observer) => {
    //   entries.forEach((entry) => {
    //     if (entry.isIntersecting) {
    //       const button = entry.target.querySelector(".btn");
    //       if (button) {
    //         button.addEventListener("click", () => toggleEvent(button));
    //       }
    //       observer.unobserve(entry.target);
    //     }
    //   });
    // };
    // const observer = new IntersectionObserver(handleIntersection, {
    //   root: null, // Use the viewport as the root
    //   rootMargin: "0px",
    //   threshold: 0.1, // Trigger when at least 10% of the element is visible
    // });
    // tables.forEach((table) => {
    //   const noteCells = table.querySelectorAll(".note.multi");
    //   noteCells.forEach((noteCell) => {
    //     observer.observe(noteCell);
    //   });
    // });
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

  // sortTableData : 테이블 정렬
  const sortTableData = () => {
    const dateTh = document.querySelectorAll(".table th.date");

    // handleSortClick : 정렬 버튼 클릭 핸들러
    const handleSortClick = (sortType, item) => {
      // sortNum : 숫자 및 날짜 정렬 함수
      const sortNum = (a, b) => {
        let datasetA = a.dataset.sort;
        let datasetB = b.dataset.sort;
        let na = (datasetA + "").replace(/[-,\s\xA0]+/gi, "");
        let nb = (datasetB + "").replace(/[-,\s\xA0]+/gi, "");
        let numA = parseFloat(na) + "";
        let numB = parseFloat(nb) + "";

        if (numA === "NaN" || numB === "NaN" || na !== numA || nb !== numB) return false;

        return sortType === "sortasc" ? parseFloat(na) - parseFloat(nb) : parseFloat(nb) - parseFloat(na);
      };

      const tbody = item.closest(".table").querySelector("tbody");
      const rows = Array.from(item.closest(".table").querySelectorAll(".table tbody tr"));
      const sortedArray = rows.sort(sortNum);
      arrayReload(sortedArray, tbody);
    };
    
    // arrayReload : 정렬된 배열을 재렌더링
    const arrayReload = (array) => {
      const data = array.map((row) => ({
        id: row.dataset.id,
        depth1: row.querySelector(".depth1").innerText,
        depth2: row.querySelector(".depth2").innerText,
        depth3: row.querySelector(".depth3").innerText,
        depth4: row.querySelector(".depth4").innerText,
        view_id: row.querySelector(".id").innerText,
        view_name: row.querySelector(".name").innerText,
        view_url: row.querySelector(".url").innerText,
        date: row.querySelector(".date").innerText,
        state: row.querySelector(".state").innerText,
        author: row.querySelector(".author").innerText,
        note: Array.from(row.querySelectorAll(".note-memo p")).map(p => p.innerText),
      }));
      console.log(data);
      const dataSort = [];
      initData(data, dataSort);
      renderTable(dataSort);
      
    };

    // 이벤트 리스너 설정
    dateTh.forEach((item) => {
      const asc = item.querySelector(".sortasc");
      const desc = item.querySelector(".sortdesc");

      asc.addEventListener("click", () => handleSortClick("sortasc", asc));
      desc.addEventListener("click", () => handleSortClick("sortdesc", desc));
    });
  };

  // 내부함수
  // 비동기 처리 setTimeout
  const waitTime = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

  // filterData : renderTable, selectFilter 사용
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

  // displayLoading : 로딩 표시
  const displayLoading = () => {
    loadDiv.classList.add("active");
  };

  // hideLoading : 로딩 숨김
  const hideLoading = () => {
    loadDiv.classList.remove("active");
  };

  // attachEventListeners : 이벤트 리스너를 필터된 테이블(dataClone)에 다시 바인딩
  const attachEventListeners = () => {
    updateTableIndex();
    updateTableProgress();
    copyTableContent();
    toggleNoteExpansion();
    toggleRowSelection();
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
  };

  // publicFunction : 외부로 return
  const publicFunction = async () => {
    console.log("Public function called");
    initData(dataArray, dataOrign);
    initTable();
    await renderTable(dataOrign);

    // utils
    initFilter();
    sortTableData();
    // hideLoading();
  };

  return {
    publicFunction: publicFunction,
  };
})();

core.publicFunction();

// 로딩 시간 체크
window.addEventListener("DOMContentLoaded", function () {
  // 시간체크
  setTimeout(function () {
    // performance.timing 더이상 사용 안함
    // PerformanceNavigationTiming 이걸로 변경
    const ntime = performance.timing;
    const total = ntime.loadEventEnd - ntime.navigationStart; //전체 소요시간
    const redirect = ntime.redirectEnd - ntime.redirectStart; // 동일 origin에서의 redirect 시간
    const cache = ntime.domainLookupStart - ntime.fetchStart; // cache 시간
    const dnslookup = ntime.domainLookupEnd - ntime.domainLookupStart; //DNS Lookup 시간
    const connect = ntime.connectEnd - ntime.connectStart; // 웹서버 연결 시간
    const request = ntime.responseStart - ntime.requestStart; // 요청 소요 시간
    const response = ntime.responseEnd - ntime.responseStart; // 응답 데이터를 모두 받은 시간
    const dom = ntime.domComplete - ntime.domLoading; // DOM객체 생성 시간 *******************
    const load = ntime.loadEventEnd - ntime.loadEventStart; // 브라우저의 Load 이벤트 실행시간
    const pageEnd = ntime.loadEventEnd - ntime.responseEnd; //  서버에서 페이지를 받고 페이지를 로드하는데 걸린 시간
    // var networkDelay = ntime.responseEnd - ntime.fetchStart; //  네트워크 지연 시간
    console.log(ntime);

    console.log("total : " + total + "ms  >>>>>>>  전체 소요시간");
    console.log("redirect : " + redirect + "ms  >>>>>>>   동일 origin에서의 redirect 시간");
    console.log("cache : " + cache + "ms   >>>>>>>  cache 시간");
    console.log("dnslookup : " + dnslookup + "ms  >>>>>>>  DNS Lookup 시간");
    console.log("connect : " + connect + "ms  >>>>>>>  웹서버 연결 시간");
    console.log("request : " + request + "ms  >>>>>>>  요청 소요 시간");
    console.log("response : " + response + "ms  >>>>>>>  첫 응답으로 부터 응답 데이터를 모두 받은 시간");
    console.log("dom : " + dom + "ms  >>>>>>>  DOM객체 로드 완료 시간");
    console.log("load : " + load + "ms  >>>>>>>  브라우저의 Load 이벤트 실행시간");
    console.log("pageEnd : " + pageEnd + "ms  >>>>>>>  서버에서 페이지를 받고 페이지를 로드하는데 걸린 시간");
  }, 6000);

  console.log("==================== start!! ====================");
});