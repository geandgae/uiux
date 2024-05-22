"use strict";

import {st, ctg} from "./data_options.js";

export let data_01 = [
  { 
    id: ctg.ct01.id,
    depth1: ctg.ct01.title,
    depth2: "d2",
    depth3: "d3",
    depth4: "d4",
    view_id: "view_id",
    view_name: "view_name",
    view_url: "aaa/aaa.url",
    date: "2022-10-28",
    state: st.fin,
    author: ctg.ct01.author,
    note: "<p>note2022-11-08</p>",
  },
  {
    id: ctg.ct01.id,
    depth1: ctg.ct01.title,
    depth2: "d2",
    depth3: "d3",
    depth4: "d4",
    view_id: "view_id",
    view_name: "view_name",
    view_url: "aaa/aaa.url",
    date: "2022-11-03",
    state: st.wait,
    author: ctg.ct01.author,
    note: "<p>note1</p>",
  },
]