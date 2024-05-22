"use strict";

// import
import { at, st, ctg } from "./data_options.js";
import { dataSet, arraySet } from "./data_set.js";
// arraySet 사용안함 확인 후 삭제

// s : init
// 로딩영역
const loadDiv = document.querySelector(".loading");

// dataOrign : dataSet(data파일모음)을 기반으로 변환된 테이블 저장 배열
const dataOrign = [];

// dataClone : 필터에서 사용...??
let dataClone = [];

// dataSort : 정렬용 데이터
let dataSort = [];
// e : init

// s : function
(function () {
  // todo
  // 변경할 점 data_options 변수 변경 ctg(카테고리) > filterInit, tableInit / author(사용자) > 필터사용 / st(진행상태) > 상태별 개수
  // 상태값 : 진행/ing   보류/삭제/del     대기/검수/wait/chk     완료/수정/fin
  // 로딩테스트 주석은 비동기처리 / 공통함수로 일괄 처리

  // 오브젝트형데이터 for of 테스트
  for (const [key, value] of Object.entries(dataSet)) {
    // console.log("==========================");
    // console.log(`Pkey : ${key}  Pvalue : ${value}`);
    // console.log("=====================child");
    for (const [k, v] of Object.entries(value)) {
      // console.log(`Ckey : ${k}  Cvalue : ${v}`);
    }
  }
  console.log(dataSet);
  console.log(arraySet);

  // dataInit : dataSet의 데이터를 테이블 형식으로 변환해서 dataOrign 배열에 저장
  const dataInit = (data, out) => {
    data.forEach(function (item) {
      out.push(`
        <tr data-sort="${item.date}" data-id="${item.id}" data-author="${item.author}" data-state="${item.state}">
          <td class="index"><p></p></td>
          <td class="depth1"><p>${item.depth1}</p></td>
          <td class="depth2"><p>${item.depth2}</p></td>
          <td class="depth3"><p>${item.depth3}</p></td>
          <td class="depth4"><p>${item.depth4}</p></td>
          <td class="id"><p>${item.view_id}</p></td>
          <td class="name"><p>${item.view_name}</p></td>
          <td class="url"><p><a href="${item.view_url}" target="blank">${item.view_url}</a></p></td>
          <td class="date"><p>${item.date}</p></td>
          <td class="state"><p>${item.state}</p></td>
          <td class="author"><p>${item.author}</p></td>
          <td class="note" data-wacc-toggle="true">
            <button type="button" class="btn" title="더보기"><i></i></button>
            <div class="note-memo target">
              ${item.note}
            </div>
          </td>
        </tr>
      `);
    });
  };

  // tableInit : data_options ctg(category)의 개수만큼 article을 생성(빈 테이블 생성)
  const tableInit = () => {
    const container = document.querySelector("main .contents");
    const article = [];
    for (const item in ctg) {
      const id = ctg[item].id;
      const title = ctg[item].title;
      // console.log(ctg[item]);
      article.push(`
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
      `);
    }
    container.innerHTML = article.join("");

    // tableView : 여기에 넣었을대 이점??
    // tableView(dataOrign);
  };

  // tableView : tableInit에서 생성한 article에 dataOrign을 뿌림(테이블 실제 데이터 생성)
  const tableView = (data) => {
    const el = document.querySelectorAll(".article");
    if (el) {
      el.forEach(function (item) {
        const id = item.getAttribute("id");
        let tr = [];
        tr = dataFilter(data, id);
        item.querySelector("tbody").innerHTML = tr.join("");

        // 로딩 테스트
        // return new Promise((resolve, reject) => {
        //   resolve(item.querySelector("tbody").innerHTML = tr.join(""));
        //   // reject 부분 추가
        // })
        // 로딩 테스트
      });
    }
  };

  // dataFilter : tableView, selectFilter 사용
  const dataFilter = (data, query) => {
    return data.filter((i) => i.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };

  // filterInit : 필터 설정
  const filterInit = () => {
    const article = document.querySelectorAll(".article");

    // typeAuthor : 작성자 옵션 생성
    const typeAuthor = document.querySelector(".filter select[name=author]");
    const author = [`<option value="">author</option>`];
    for (const item in at) {
      author.push(`
        <option value="${at[item]}">${at[item]}</option>
      `);
    }
    typeAuthor.innerHTML = author.join("");

    // typeState : 상태값 옵션 생성
    const typeState = document.querySelector(".filter select[name=state]");
    const state = [`<option value="">state</option>`];
    for (const item in st) {
      state.push(`
        <option value="${st[item]}">${st[item]}</option>
      `);
    }
    typeState.innerHTML = state.join("");

    // typeCategory : 카테고리 버튼 생성 삭제할 수도...
    const typeCategory = document.querySelector(".category");
    const category = [`<li><button type="button" class="btn" id="table_all">전체보기</button></li>`];
    for (const item in ctg) {
      const id = ctg[item].id;
      const title = ctg[item].title;
      category.push(`
        <li><button type="button" class="btn" id="${id}">${title}</button></li>
      `);
    }
    typeCategory.innerHTML = category.join("");

    // categoryFilter : 카테고리 필터 기능
    const categoryFilter = () => {
      // event
      const evt = (e) => {
        const id = e.currentTarget.id;
        const articleView = () => {
          // article
          article.forEach((i) => {
            i.classList.add("hide");
            if (id === i.id) {
              i.classList.remove("hide");
            } else if (id === "table_all") {
              i.classList.remove("hide");
            }
          });
        };
        // 로딩 테스트
        loadDiv.classList.add("active");
        const promise = function () {
          return new Promise((resolve, reject) => {
            resolve(articleView());
          });
        };
        const runResult = async () => {
          console.log("loding");
          await promise();
          console.log("loding-end");
          loadDiv.classList.remove("active");
        };
        setTimeout(() => {
          runResult();
        }, 0);
        // 로딩 테스트
      };
      // 실행부
      const btn = document.querySelectorAll(".category .btn");
      if (btn) {
        btn.forEach((item) => {
          item.addEventListener("click", evt);
        });
      }
    };

    // selectFilter
    const selectFilter = () => {
      const select = document.querySelectorAll(".filter select");
      // searchSel
      const searchSel = (type) => {
        // dataFilter : dataFilter함수를 이용 dataOrign을 iv로 필터링 한 후 dataClone에 저장
        const iv = input.value;
        dataClone = dataFilter(dataOrign, iv);
        console.log(dataClone);
        // tableView : 테이블을 dataClone으로 다시 그림
        tableView(dataClone);

        // 로딩 테스트 --확인 후 삭제
        const runResult = async () => {
          console.log("loding");
          // await tableView(dataClone);
          console.log("loding-end");
          loadDiv.classList.remove("active");
        };
        runResult();
        // 로딩 테스트 --확인 후 삭제

        // reset : 검색창 인풋값 리셋
        if (select) {
          select.forEach(function (item) {
            if (type === item.name) {
              item.classList.remove("reset");
            } else {
              item.classList.add("reset");
            }
            if (item.classList.contains("reset")) {
              item.value = "";
            }
          });
        }
      };

      // select
      if (select) {
        select.forEach((item) => {
          item.addEventListener("change", function () {
            const name = item.name;
            const option = item.options[item.selectedIndex].value;
            input.value = option;
            // 로딩 테스트
            loadDiv.classList.add("active");
            setTimeout(() => {
              searchSel(name);
            }, 0);
            // 로딩 테스트
          });
        });
      }

      // 버튼이벤트
      const btn = document.querySelector(".filter .search .btn");
      // keyword
      // btn.addEventListener("click", () => {
      //   // 로딩 테스트
      //   loadDiv.classList.add("active");
      //   setTimeout(() => {
      //     searchSel("keyword");
      //   }, 0);
      //   // 로딩 테스트
      // });
      const input = document.querySelector(".filter input[type=text]");
      input.addEventListener("keyup", () => {
        // 로딩 테스트
        loadDiv.classList.add("active");
        setTimeout(() => {
          searchSel("keyword");
        }, 0);
        // 로딩 테스트
      });
    };

    // run
    categoryFilter();
    selectFilter();
  };


  // tableIndex : 전체개수
  const tableIndex = () => {
    const el = document.querySelectorAll(".table td.index > p");
    const counter = document.querySelector(".counter");
    const length = el.length;
    counter.innerHTML = `총 ${length} 개`;
    // 자동번호 부여
    if (el) {
      for (let i = 0; i < el.length; i++) {
        const item = el[i];
        let num = i + 1;
        item.innerText = num;
      }
    }
  };

  // tableState : 진행상태 개수
  const tableState = () => {
    const el = document.querySelectorAll(".table tbody tr[data-state]");
    const l = el.length;
    const state = {
      text: {
        fin: st.fin,
        mod: st.mod,
        del: st.del,
        wait: st.wait,
        chk: st.chk,
        ing: st.ing,
      },
      count: {
        fin: 0,
        mod: 0,
        del: 0,
        wait: 0,
        chk: 0,
        ing: 0,
      },
    };
    if (el) {
      el.forEach(function (item) {
        const text = item.dataset.state;
        if (text === state.text.fin) {
          item.classList.add("fin");
          state.count.fin++;
        } else if (text === state.text.mod) {
          item.classList.add("mod");
          state.count.mod++;
        } else if (text === state.text.del) {
          item.classList.add("del");
          state.count.del++;
        } else if (text === state.text.wait) {
          item.classList.add("wait");
          state.count.wait++;
        } else if (text === state.text.chk) {
          item.classList.add("chk");
          state.count.chk++;
        } else if (text === state.text.ing) {
          item.classList.add("ing");
          state.count.ing++;
        }
      });
    }

    // process
    const total = Math.round((state.count.fin / l) * 100);
    const progress = document.querySelector(".progress");
    const inc = `
      <ul class="progress-info">
        <li>전체 : ${l}</li>
        <li>${state.text.fin} : ${state.count.fin}</li>
        <li>${state.text.mod} : ${state.count.mod}</li>
        <li>${state.text.del} : ${state.count.del}</li>
        <li>${state.text.wait} : ${state.count.wait}</li>
        <li>${state.text.chk} : ${state.count.chk}</li>
        <li>${state.text.ing} : ${state.count.ing}</li>
      </ul>
      <div class="progress-bar">
        <div class="text">${total}%</div>  
        <div class="bar">
          <span role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${total}" style="width:${total}%"></span>
        </div>  
      </div>  
    `;
    progress.innerHTML = inc;
  };

  // tableCopy : 복사문법 변경 해야함 execCommand > window.navigator.clipboard.writeText(copyBox.textContent).then(() => { 내용 });
  const tableCopy = () => {
    // setToast : 공통으로 빼기
    const setToast = function (target) {
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
      // setTimeout(() => {
      //   outland.innerHTML = "";
      // }, 500);
    };
    

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
    elements.forEach(function (item) {
      item.addEventListener("click", function () {
        // 클릭된 요소의 텍스트를 클립보드에 복사
        copyTextToClipboard(item);
      });
    });


    // // async 타입
    // const copyTextToClipboard2 = async (target) => {
    //   try {
    //     await navigator.clipboard.writeText(target.textContent);
    //     // success();
    //     console.log("복사완료");
    //     console.log(target.textContent);
    //     // toast 팝업 호출
    //     const copyContent = target.textContent;
    //     setToast(copyContent);
    //   } catch {
    //     // fail();
    //     console.log("복사실패");
    //     console.log(target.textContent);
    //   }
    // }

    // const el = document.querySelectorAll(".table td p");

    // if (el) {
    //   el.forEach(function (item) {
    //     item.addEventListener("click", function () {
    //       // then copy
    //       // window.navigator.clipboard.writeText(item.textContent).then(() => {
    //       //   console.log(item.textContent);
    //       // });
    //       copyTextToClipboard2(item);
    //     });
    //   });
    // }
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
        note.forEach(function (item) {
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

  // dataInit
  dataInit(dataSet, dataOrign);

  // tableInit
  tableInit();
  tableView(dataOrign);

  // filterInit
  filterInit();

  // utils
  tableIndex();
  tableState();
  tableCopy();
  noteToggle();
  tableCheck();







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

  // async function f() {
  //   return Promise.resolve(1);
  // }

  // f().then(alert); // 1
})();
// e : function

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
