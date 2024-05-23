"use strict";

// import
import {data_00} from "./data_00.js";
import {data_01} from "./data_01.js";
import {data_02} from "./data_02.js";
import {data_03} from "./data_03.js";
import {data_04} from "./data_04.js";
// import {data_05} from "./data_05.js";
// import {data_06} from "./data_06.js";
// import {data_07} from "./data_07.js";
// import {data_08} from "./data_08.js";
// import {data_09} from "./data_09.js";
// import {data_10} from "./data_10.js";


// for (let item in data_00) {
//   data_00[item].id = ctg.ct00.id;
//   data_00[item].depth1 = ctg.ct00.title;
//   if (data_00[item].state === "대기") {
//     data_00[item].state = st.stay;
//   }
// }
// for (let item in data_01) {
//   data_01[item].id = ctg.ct01.id;
//   data_01[item].depth1 = ctg.ct01.title;
// }
// for (let item in data_02) {
//   data_02[item].id = ctg.ct02.id;
//   data_02[item].depth1 = ctg.ct02.title;
// }


// arraySet
// export const arraySet = [
//   data_00,
//   // data_01,
//   // data_02,
// ];

// dataArray
export const dataArray = [
  ...data_00,
  ...data_01, 
  ...data_02,
  ...data_03,
  ...data_04,
  // ...data_05,
  // ...data_06,
  // ...data_07,
  // ...data_08,
  // ...data_09,
  // ...data_10,
];