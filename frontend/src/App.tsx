import { DocHandle, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";

import { stdTheories } from "./theory";
import { ModelNotebook, ModelNotebookEditor } from "./model";
import { newNotebook } from "./notebook";


function App() {
  const theories = stdTheories();
  const init: ModelNotebook = {
    name: "Untitled",
    notebook: newNotebook(),
  };

  const repo = new Repo({
    storage: new IndexedDBStorageAdapter("catcolab-demo"),
    network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
  });

  const handleId = document.location.hash.substring(1);
  let handle: DocHandle<ModelNotebook>;
  if (isValidAutomergeUrl(handleId)) {
    handle = repo.find(handleId);
  } else {
    handle = repo.create<ModelNotebook>(init);
    document.location.hash = handle.url;
  }

  return (
    <ModelNotebookEditor handle={handle} init={init} theories={theories} />
  );
}

export default App;
