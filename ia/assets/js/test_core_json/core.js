"use strict";

const core = (() => {
  // init
  let dataJson = [];
  const dataOrign = [];
  // creator
  const at = {
    u_00: "사용자00",
    u_01: "사용자01",
    u_02: "사용자02",
  };
  // state
  const st = {
    fin: "완료",
    mod: "수정",
    del: "삭제",
    wtn: "대기",
    chk: "검수",
    ing: "진행",
  };
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

  // 로딩 화면 표시 상태 변수
  let isLoading = false;

  // 로딩 화면을 표시하는 함수
  const displayLoading = () => {
    // 이미 로딩 중인 경우 중복으로 로딩 화면을 표시하지 않도록 합니다.
    if (isLoading) {
      return;
    }
    // 로딩 화면을 보여주는 UI 작업을 수행합니다.
    // 예를 들어, 화면의 특정 위치에 로딩 스피너를 추가하는 코드를 작성합니다.
    // const loadingSpinner = document.createElement("div");
    // loadingSpinner.classList.add("loading-spinner");
    // 로딩 스피너를 보여주는 UI 작업을 수행합니다.
    // 예를 들어, 어딘가에 loadingSpinner를 추가하거나, loadingSpinner를 화면에 표시합니다.
    // 로딩 상태를 true로 설정합니다.
    isLoading = true;
    console.log("isLoading = true; / 로딩중");
  };

  // 로딩 화면을 숨기는 함수
  const hideLoading = () => {
    // 로딩 화면을 숨기는 UI 작업을 수행합니다.
    // 예를 들어, 화면에서 로딩 스피너를 제거하는 코드를 작성합니다.
    // const loadingSpinner = document.querySelector(".loading-spinner");
    // if (loadingSpinner) {
    //   loadingSpinner.remove();
    // }
    // 로딩 상태를 false로 설정합니다.
    isLoading = false;
    console.log("isLoading = false; / 로딩완료");
  };

  // 제이슨 데이터 불러오기
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
      const numNote = item.note.length;
      const hasMultipleNotes = numNote > 1;
      const multiClass = hasMultipleNotes ? "multi" : "";
      let noteRow = [];
      item.note.forEach((note) => {
        noteRow.push(`<p>${note}</p>`);
      });
      const tableRow = `
        <tr data-id="${item.id}" data-sort="${item.date}">
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
  };

  // 비동기 처리 setTimeout
  const waitTime = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

  // filterData : renderTable, selectFilter 사용
  const filterData = (data, query) => {
    return data.filter((i) => i.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };

  // publicFunction : 외부로 return
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
  };

  // 외부로 함수 return
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
