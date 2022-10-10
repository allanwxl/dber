/* Creating a database called graphDB and creating a table called graphs. */

import Dexie from 'dexie';
import { Notification } from '@arco-design/web-react';
import { diffJson } from 'diff';
// import dynamic from 'next/dynamic';
import dexieCloud from "dexie-cloud-addon";
import relationships from 'dexie-relationships'

// const { dexieCloud } = dynamic(() => import('dexie-cloud-addon'), { ssr: false });

// dexieCloud = dynamic(() => import('dexie-cloud-addon'), { ssr: false });

// 解决方法 next ssr问题
// https://github.com/dexie/Dexie.js/issues/1614
// https://github.com/asyncapi/asyncapi-react/issues/177

// console.log(dexieCloud);


export const db = new Dexie('graphDB', {addons: [relationships, dexieCloud]});

// console.log(db);
// &代表id是独一无二的 和sql的unique类似，*代表tags可以是数组 支持多项索引 作者：西芹术士 https://www.bilibili.com/read/cv15712691/ 出处：bilibili
db.version(3).stores({
  graphs: 'id',
  meta: 'id, inited',
  logs: 'graphId',
});

// https://dexie.org/cloud/docs/db.cloud.configure()
db.cloud.configure({
  // databaseUrl: "https://zjnesf405.dexie.cloud", // 少锋
  databaseUrl: "https://zcd5vm8q3.dexie.cloud", // 选旅
  requireAuth: false,
  unsyncedTables: ['openCloseStates']
  // tryUseServiceWorker: true, // true!
})

export const saveGraph = async ({
  id,
  name,
  tableDict,
  linkDict,
  box,
}) => {
  const now = new Date().valueOf();
  try {
    const data = await db.graphs.get(id);
    await db.graphs.put({
      id,
      tableDict,
      linkDict,
      box,
      name,
      updatedAt: now,
    });

    const logJson = {
      tableDict: data.tableDict,
      linkDict: data.linkDict,
      name: data.name,
    };

    if (diffJson({ tableDict, linkDict, name }, logJson).length > 1) {
      db.logs.add({
        graphId: id,
        updatedAt: data.updatedAt,
        ...logJson,
      });
    }

    Notification.success({
      title: 'Save success',
    });
  } catch (e) {
    Notification.error({
      title: 'Save failed',
    });
  }
};

