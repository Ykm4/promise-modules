import { useState } from 'react'
import './App.css'
import PQueue from 'p-queue'

// 同時実行数を4に設定
const queue = new PQueue({ concurrency: 4 })

const fetchSomething = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

function App() {
  const [waiting, setWaiting] = useState<string[]>([])
  const [processing, setProcessing] = useState<string[]>([])
  const [done, setDone] = useState<string[]>([])

  // 新しいタスクをキューに追加し、そのタスクの状態（待機、処理中、完了）を監視・更新する
  const addTask = async () => {
    // タスクを一意に識別するためのIDとしてISO形式の文字列（"2023-09-05T12:34:56.789Z"）を使用
    const taskId = new Date().toISOString()

    // 待機タスクリストにタスクIDを追加
    setWaiting((prev) => [...prev, taskId])

    // queue.addメソッドでタスクをキューに追加する
    await queue.add(async () => {
      // タスクがキューで処理を開始すると、
      // そのタスクIDはwaitingリストから削除され、processingリストに追加される
      setWaiting((prev) => prev.filter((id) => id !== taskId))
      setProcessing((prev) => [...prev, taskId])

      // 3秒かかる処理がスタート
      await fetchSomething()

      // タスクが完了すると、そのタスクIDはprocessingリストから削除され、doneリストに追加される
      setProcessing((prev) => prev.filter((id) => id !== taskId))
      setDone((prev) => [...prev, taskId])
    })
  }

  return (
    <div>
      <button onClick={addTask} className="Button">
        Add Task
      </button>

      <div className="StatusBox">
        <div className="StatusBox_Title">Waiting</div>
        <div id="waiting" className="StatusBox_Count">
          {waiting.length}
        </div>
        <div id="waiting-graph" className="StatusBox_Graph -Waiting">
          {waiting.map(() => (
            <div className="StatusBox_GraphRect"></div>
          ))}
        </div>

        <div className="StatusBox_Title">Processing</div>
        <div id="processing" className="StatusBox_Count">
          {processing.length}
        </div>
        <div id="processing-graph" className="StatusBox_Graph -Processing">
          {processing.map(() => (
            <div className="StatusBox_GraphRect"></div>
          ))}
        </div>

        <div className="StatusBox_Title">Done</div>
        <div id="done" className="StatusBox_Count">
          {done.length}
        </div>
        <div id="done-graph" className="StatusBox_Graph -Done">
          {done.map(() => (
            <div className="StatusBox_GraphRect"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
