"use strict";

// import
import { at, st, ctg } from "./data_options.js";
import { dataArray } from "./data_set.js";
// arraySet 사용안함 확인 후 삭제


// 테이블세팅 자동화 data_option 변수 처리
// 정렬
// json 로컬 저장
// 인클루드
// 다크모드
// 로딩
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
// 로딩테스트 주석은 비동기처리 / 공통함수로 일괄 처리



// s : function
const core = (function () {

  // init 전역변수 선언
  // 로딩영역
  const loadDiv = document.querySelector(".loading");
  // dataOrign : dataArray(data파일모음)을 기반으로 변환된 테이블 저장 배열
  const dataOrign = [];
  // dataClone : 필터에서 사용.
  let dataClone = [];

  // initData : dataArray의 데이터를 테이블 형식으로 변환해서 dataOrign 배열에 저장
  const initData = (data, out) => {
    data.forEach((item) => {
      const tableRow = `
        <tr data-sort="${item.date}" data-id="${item.id}" data-author="${item.author}" data-state="${item.state.trim() === "" ? "대기" : item.state}">
          <td class="index"><p></p></td>
          <td class="depth1"><p>${item.depth1}</p></td>
          <td class="depth2"><p>${item.depth2}</p></td>
          <td class="depth3"><p>${item.depth3}</p></td>
          <td class="depth4"><p>${item.depth4}</p></td>
          <td class="id"><p>${item.view_id}</p></td>
          <td class="name"><p>${item.view_name}</p></td>
          <td class="url"><p><a href="${item.view_url}" target="blank">${item.view_url}</a></p></td>
          <td class="date"><p>${item.date}</p></td>
          <td class="state"><p>${item.state.trim() === "" ? "대기" : item.state}</p></td>
          <td class="author"><p>${item.author}</p></td>
          <td class="note" data-wacc-toggle="true">
            <button type="button" class="btn" title="더보기"><i></i></button>
            <div class="note-memo target">${item.note}</div>
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
    const articles = Object.values(ctg).map(category => {
      const {id, title} = category;
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
      `
    });
    container.innerHTML = articles.join("");
  };

  // renderTable : initTable에서 생성한 article에 dataOrign을 뿌림(테이블 실제 데이터 생성)
  const renderTable = (data) => {
    const article = document.querySelectorAll(".article");
    article.forEach((item) => {
      const id = item.getAttribute("id");
      const tableBody = item.querySelector("tbody");
      const filteredData = dataFilter(data, id);
      tableBody.innerHTML = filteredData.join("");

      // 로딩 테스트
      // return new Promise((resolve, reject) => {
      //   resolve(item.querySelector("tbody").innerHTML = tr.join(""));
      //   // reject 부분 추가
      // })
      // 로딩 테스트
    });
  };



  // utils
  // initFilter : 필터 옵션 실행
  const initFilter = () => {
    initAuthorOptions();
    initStateOptions();
    initCategoryButtons();
    initCategoryFilter();
    initSelectFilter();
  }

  // initAuthorOptions : 작성자 옵션 초기화
  const initAuthorOptions = () => {
    const authorSelect = document.querySelector(".filter select[name=author]");
    const authorOptions = [`<option value="">author</option>`];
    for (const item in at) {
      authorOptions.push(`<option value="${at[item]}">${at[item]}</option>`);
    }
    authorSelect.innerHTML = authorOptions.join("");
  }

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
  }

  // initCategoryButtons : 카테고리 버튼 초기화 : 카테고리 버튼 생성 삭제할 수도있음
  const initCategoryButtons = () => {
    const categoryContainer = document.querySelector(".category");
    const categorybuttons = [`<li><button type="button" class="btn" id="table_all">전체보기</button></li>`];
    for (const item in ctg) {
      const id = ctg[item].id;
      const title = ctg[item].title;
      categorybuttons.push(`<li><button type="button" class="btn" id="${id}">${title}</button></li>`);
    }
    if(categoryContainer) {
      categoryContainer.innerHTML = categorybuttons.join("");
    }
  }

  // initCategoryFilter : 카테고리 필터 초기화
  const initCategoryFilter = () => {
    const categoryButtons = document.querySelectorAll(".category .btn");
    const articles = document.querySelectorAll(".article");

    const filterByCategory = (event) => {
      const categoryId = event.currentTarget.id;

      articles.forEach((item) => {
        item.classList.add("hide");
        if (categoryId === item.id || categoryId === "table_all") {
          item.classList.remove("hide");
        }
      });

      // 로딩 테스트
      // loadDiv.classList.add("active");
      // const promise = function () {
      //   return new Promise((resolve, reject) => {
      //     resolve(articleView());
      //   });
      // };
      // const runResult = async () => {
      //   console.log("loding");
      //   await promise();
      //   console.log("loding-end");
      //   loadDiv.classList.remove("active");
      // };
      // setTimeout(() => {
      //   runResult();
      // }, 0);
      // 로딩 테스트

      displayLoading();
      setTimeout(hideLoading, 0);
    };

    categoryButtons.forEach((item) => {
      item.addEventListener("click", filterByCategory);
    });
  }

  // initSelectFilter : 선택필터 초기화
  const initSelectFilter = () => {
    const selects = document.querySelectorAll(".filter select");
    const input = document.querySelector(".filter input[type=text]");
   
    const filterBySelect = () => {
      const keyword = input.value;  
      dataClone = dataFilter(dataOrign, keyword);
      // renderTable : 테이블을 dataClone으로 다시 그림
      renderTable(dataClone);

      // 로딩 테스트 --확인 후 삭제
      // const runResult = async () => {
      //   console.log("loding");
      //   // await renderTable(dataClone);
      //   console.log("loding-end");
      //   loadDiv.classList.remove("active");
      // };
      // runResult();
      // 로딩 테스트 --확인 후 삭제
    };

    // 선택 옵션 실행
    selects.forEach((item) => {
      item.addEventListener("change", function () {
        const option = item.options[item.selectedIndex].value;
        input.value = option;
        filterBySelect();
      });
    });

    // 검색 입력값 실행
    input.addEventListener("keyup", () => {
      filterBySelect();
    });
  }

  // updateTableIndex : 전체개수
  const updateTableIndex = () => {
    const cells = document.querySelectorAll(".table td.index > p");
    const counter = document.querySelector(".counter");
    const length = cells.length;

    // 전체 글 개수
    if(counter) {
      counter.innerHTML = `총 ${length} 개`;
    }

    // 글번호
    cells.forEach((cell, index) => {
      const number = index + 1;
      cell.textContent = number
    });
  };

  // updateTableProgress : 진행상태 개수
  const updateTableProgress = () => {
    const rows = document.querySelectorAll(".table tbody tr[data-state]");
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
      const stateText = item.dataset.state;
      console.log(item.querySelector(".state p").textContent);
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

  // noteToggle
  const noteToggle = () => {
    const evt = function (e) {
      console.log("noteToggleEvt!!!!! --- evt");
      e.currentTarget.closest(".note").classList.toggle("active");
      e.currentTarget.classList.toggle("active");
    };

    const noteToggleEvt = function () {
      console.log("noteToggleEvt!!!!! --- loading");
      const note = document.querySelectorAll(".table td.note");
      if (note) {
        note.forEach((item) => {
          const memo = item.querySelectorAll(".note-memo p");
          const btn = item.querySelector(".btn");
          if (memo.length > 1) {
            item.closest(".note").classList.add("multi");
            btn.addEventListener("click", evt);
          }
        });
      }
    };

    noteToggleEvt();
  };

  // tableCheck
  const tableCheck = () => {
    const evt = (e) => {
      // console.log(e.currentTarget);
      e.currentTarget.classList.toggle("select");
    };
    function tableCheckEvt() {
      const el = document.querySelectorAll(".table tbody tr");
      if (el) {
        el.forEach((item) => {
          item.addEventListener("click", evt);
        });
      }
    }
    // 이벤트를 두번 실행하는 이유 첫 동작시 실행 안됨 원인 찾아서 해결
    tableCheckEvt();

    document.addEventListener("click", () => {
      tableCheckEvt();
    });
  };

  // copyTableContent : 테이블 내용을 복사하는 함수
  const copyTableContent = () => {
    // 클립보드에 텍스트를 복사하는 함수
    const copyTextToClipboard = async (el) => {
      try {
        // 대상 요소의 텍스트 내용을 클립보드에 복사 시도
        await navigator.clipboard.writeText(el.textContent);

        // 복사 성공 메시지와 복사된 내용을 콘솔에 출력
        console.log("복사 완료");
        console.log(el.textContent);

        // 복사된 내용을 변수에 저장
        const copyContent = el.textContent;

        // 복사된 내용으로 토스트 팝업 호출 (setToast 함수가 정의되어 있어야 합니다)
        setToast(copyContent);
      } catch (error) {
        // 복사 실패 메시지와 시도한 내용을 콘솔에 출력
        console.log("복사 실패");
        console.log(el.textContent);

        // 에러 메시지를 콘솔에 출력
        console.error(error);
      }
    };

    // 모든 .table td p 요소를 선택
    const elements = document.querySelectorAll(".table td p");

    // 각 요소에 클릭 이벤트 리스너를 추가
    elements.forEach((item) => {
      item.addEventListener("click", function () {
        // 클릭된 요소의 텍스트를 클립보드에 복사
        copyTextToClipboard(item);
      });
    });
  };


  // 내부함수
  // dataFilter : renderTable, selectFilter 사용
  const dataFilter = (data, query) => {
    return data.filter((i) => i.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  
  // setToast : 토스트 메시지를 표시하는 함수
  const setToast = (target) => {
    const outland = document.querySelector("#outland");
    const toast = `
      <div class="toast">
        <div class="inner">
          <p class="text">
            <span class="var">
              "<em>${target}</em>"
            </span>
            <span>복사되었습니다.</span>
          </p>
        </div>
      </div>
    `;
    outland.innerHTML = toast;
    setTimeout(() => {
      outland.innerHTML = "";
    }, 500);
  };

  // 로딩 표시
  const displayLoading = () => {
    loadDiv.classList.add("active");
  };

  // 로딩 숨김
  const hideLoading = () => {
    loadDiv.classList.remove("active");
  };


  // 외부에서 접근할 수 있는 함수
  const publicFunction = () => {
    console.log("Public function called");
    // initData
    initData(dataArray, dataOrign);

    // initTable
    initTable();
    renderTable(dataOrign);

    // initFilter
    initFilter();

    // utils
    updateTableIndex();
    updateTableProgress();
    noteToggle();
    tableCheck();

    // 테이블 내용을 복사하는 함수
    copyTableContent();
  };

  // 외부로 노출될 함수나 변수를 반환
  return {
    publicFunction: publicFunction
  };
})();
// e : function


// 모듈에서 publicFunction 호출
core.publicFunction();
















// 모듈 실헹방식 테스트
const myModule = (function () {
  // 내부에서 사용
  let value = "value";
  const getValue = (text) => {
    value = text
  };

  // 외부함수
  const setValue = () => {
    getValue("test!!!");
    console.log(value);
  };


  const publicFunction = () => {
    // 외부에서 접근할 수 있는 함수
    console.log("Public function called");
    setValue();
  };

  // 외부로 노출될 함수나 변수를 반환
  return {
    publicFunction: publicFunction
  };
})();
// 모듈에서 publicFunction 호출
myModule.publicFunction();



// 테스트2
const myModule2 = (function () {
  let counter = 0;

  const incrementCounter = () => {
    counter++;
  };

  const resetCounter = () => {
    counter = 0;
  };

  const getCounterValue = () => {
    return counter;
  };

  const incrementAndLogCounter = () => {
    incrementCounter();
    console.log(`Counter incremented to ${counter}`);
  };

  const publicFunction = () => {
    incrementAndLogCounter();
  };

  return {
    publicFunction: publicFunction,
    getCounterValue: getCounterValue
  };
})();

myModule2.publicFunction(); // Counter incremented to 1
myModule2.publicFunction(); // Counter incremented to 2

// console.log(myModule2.getCounterValue()); // 2



// 숨김처리
// // 로딩 시간 체크
// window.addEventListener('DOMContentLoaded', function() {
//   loadDiv.classList.remove("active");

//   // 시간체크
//   setTimeout(function() {
//     // performance.timing 더이상 사용 안함
//     // PerformanceNavigationTiming 이걸로 변경
//     const ntime = performance.timing;
//     const total = ntime.loadEventEnd - ntime.navigationStart; //전체 소요시간
//     const redirect = ntime.redirectEnd - ntime.redirectStart; // 동일 origin에서의 redirect 시간
//     const cache = ntime.domainLookupStart - ntime.fetchStart; // cache 시간
//     const dnslookup = ntime.domainLookupEnd - ntime.domainLookupStart; //DNS Lookup 시간
//     const connect = ntime.connectEnd - ntime.connectStart; // 웹서버 연결 시간
//     const request = ntime.responseStart - ntime.requestStart; // 요청 소요 시간
//     const response = ntime.responseEnd - ntime.responseStart; // 응답 데이터를 모두 받은 시간
//     const dom = ntime.domComplete - ntime.domLoading; // DOM객체 생성 시간 *******************
//     const load = ntime.loadEventEnd - ntime.loadEventStart; // 브라우저의 Load 이벤트 실행시간
//     const pageEnd = ntime.loadEventEnd - ntime.responseEnd; //  서버에서 페이지를 받고 페이지를 로드하는데 걸린 시간
//     // var networkDelay = ntime.responseEnd - ntime.fetchStart; //  네트워크 지연 시간
//     console.log(ntime);

//     console.log("total : " + total + "ms  >>>>>>>  전체 소요시간");
//     console.log("redirect : " + redirect + "ms  >>>>>>>   동일 origin에서의 redirect 시간");
//     console.log("cache : " + cache + "ms   >>>>>>>  cache 시간");
//     console.log("dnslookup : " + dnslookup + "ms  >>>>>>>  DNS Lookup 시간");
//     console.log("connect : " + connect + "ms  >>>>>>>  웹서버 연결 시간");
//     console.log("request : " + request + "ms  >>>>>>>  요청 소요 시간");
//     console.log("response : " + response + "ms  >>>>>>>  첫 응답으로 부터 응답 데이터를 모두 받은 시간");
//     console.log("dom : " + dom + "ms  >>>>>>>  DOM객체 로드 완료 시간");
//     console.log("load : " + load + "ms  >>>>>>>  브라우저의 Load 이벤트 실행시간");
//     console.log("pageEnd : " + pageEnd + "ms  >>>>>>>  서버에서 페이지를 받고 페이지를 로드하는데 걸린 시간");

//   }, 6000);

//   console.log("==================== start!! ====================");
// });
