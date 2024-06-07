"use strict";

class Core {
  constructor(ctg, jsonFilePaths) {
    this.dataJson = [];
    this.dataOrign = [];
    this.ctg = ctg;
    this.isLoading = false;
    this.jsonFilePaths = jsonFilePaths;
  }

  displayLoading() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    console.log("isLoading = true; / 로딩중");
  }

  hideLoading() {
    this.isLoading = false;
    console.log("isLoading = false; / 로딩완료");
  }

  async fetchData(filePaths) {
    try {
      this.displayLoading();
      const fetchPromises = filePaths.map((filePath) =>
        fetch(filePath).then((response) => response.json())
      );
      const data = await Promise.all(fetchPromises);
      this.hideLoading();
      return data.flat();
    } catch (error) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      this.hideLoading();
      return null;
    }
  }

  async initData(data, out) {
    this.displayLoading();
    await this.waitTime(0);
    const btnMore = `<button type="button" class="btn" title="더보기"><i></i></button>`;
    data.forEach((item) => {
      const recentDate = this.calculateDateDifference(item.date);
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
          <td class="url"><p><a href="${item.view_url}" target="blank">${item.view_url}</a></p></td>
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
    this.hideLoading();
  }

  initTable() {
    const container = document.querySelector(".contents");
    const articles = Object.values(this.ctg).map((category) => {
      const { id, title } = category;
      return `
        <article class="article" id="${id}">
          <h2>${title}</h2>
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
        </article>
      `;
    });
    container.innerHTML = articles.join("");
  }

  async renderTable(data) {
    this.displayLoading();
    const articles = document.querySelectorAll(".article");
    await this.waitTime(0);
    articles.forEach((item) => {
      const id = item.getAttribute("id");
      const tableBody = item.querySelector("tbody");
      const filteredData = this.filterData(data, id);
      tableBody.innerHTML = filteredData.join("");
    });
    this.hideLoading();
  }

  waitTime(timeToDelay) {
    return new Promise((resolve) => setTimeout(resolve, timeToDelay));
  }

  filterData(data, query) {
    return data.filter((i) => i.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }

  calculateDateDifference(inputDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const input = new Date(inputDate);
    const timeDifference = input.getTime() - today.getTime();
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  }

  async publicFunction(data) {
    console.log("Public function called");
    this.dataJson = data || await this.fetchData(this.jsonFilePaths);
    if (this.dataJson) {
      console.log("데이터를 성공적으로 불러왔습니다:");
      await this.initData(this.dataJson, this.dataOrign);
      this.initTable();
      await this.renderTable(this.dataOrign);
    } else {
      console.error("데이터 불러오기 중 오류가 발생했습니다");
    }
  }
}

// ctg와 jsonFilePaths를 외부에서 주입받습니다.
const ctg = {
  ct00: { id: "table_00", title: "table_00" },
  ct01: { id: "table_01", title: "table_01" },
};
const jsonFilePaths = [
  "./assets/js/test_core_json_class/data_00.json",
  "./assets/js/test_core_json_class/data_01.json",
];

// 새로운 인스턴스를 생성하고 데이터를 매개변수로 전달합니다.
const core = new Core(ctg, jsonFilePaths);
core.publicFunction();
