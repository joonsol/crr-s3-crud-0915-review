import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import api from "../api";
import "./style/FileList.scss";
const FileList = forwardRef((props, ref) => {
  const [items, setItems] = useState([]);
const load = async () => {
  // Date.now()를 쿼리스트링으로 붙여 캐시를 회피
  const { data } = await api.get("/files", { params: { t: Date.now() } });
  setItems(data);
};
  useEffect(() => {
    load();
  }, []);
  // 부모에서 ref.current.load() 호출할 수 있게 노출
  useImperativeHandle(ref, () => ({ load }));

  const del = async id => {
    await api.delete(`/files/${id}`); await load();
  };

  return (
    <ul className="file-list">
      {items.map(it => (
        <li
          key={it._id}
        >
          <div>
            <h3>{it.title || it.originalName}</h3>
          </div>
          {it.contentType?.startsWith("image/") && (
            <img src={it.url} alt="" style={{ maxWidth: 200, display: "block" }} />
          )}
          <p>{it.description}</p>
          <div className="btns-wrap">

            <a href={it.url} target="_blank" rel="noreferrer">Open</a>
            <button onClick={() => del(it._id)} style={{ marginLeft: 8 }}>Delete</button>
          </div>
        </li>
      ))}
    </ul>

  )
})

export default FileList