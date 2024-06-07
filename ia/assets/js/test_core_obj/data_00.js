"use strict";

import {st, ctg} from "./data_options.js";

export let data_00 = [
  { 
    id: ctg.ct00.id,
    depth1: ctg.ct00.title,
    depth2: "d99",
    depth3: "d3",
    depth4: "d4",
    view_id: "view_id",
    view_name: "view_name",
    view_url: "aaa/aaa1.url",
    date: "2024-05-28",
    state: st.fin,
    author: ctg.ct00.author,
    note: ["note1", "note2", "note3"],
  },
  { 
    id: ctg.ct00.id,
    depth1: ctg.ct00.title,
    depth2: "d99",
    depth3: "d3",
    depth4: "d4",
    view_id: "view_id",
    view_name: "view_name",
    view_url: "aaa/aaa2.url",
    date: "2024-05-28",
    state: st.fin,
    author: ctg.ct01.author,
    note: ["note1", "note2", "note3"],
  },
  { 
    id: ctg.ct00.id,
    depth1: ctg.ct00.title,
    depth2: "d102",
    depth3: "d3",
    depth4: "d4",
    view_id: "view_id",
    view_name: "view_name",
    view_url: "aaa/aaa3.url",
    date: "2024-05-28",
    state: st.fin,
    author: ctg.ct02.author,
    note: ["note1", "note2", "note3"],
  },
]