import { useState } from "react";
import api from "../api";
import "./style/UploadForm.scss"

const UploadForm = ({ onDone }) => {
  // 1) 폼 상태
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false); // UX: 업로드 중 중복 클릭 방지

  // 업로드 핸들러
  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert("파일을 선택하세요.");
    setLoading(true);
    try {
      console.log("📂 업로드 시작:", file);

      // (A) 서버에 presign 요청: S3에 쓸 '임시 업로드 URL'과 'key' 발급
      const { data: { url, key } } = await api.post('/files/presign', {
        filename: file.name,
        contentType: file.type
      });
      console.log("🔐 presign 발급 성공:", { url, key });

      // (B) 받은 URL로 S3에 직접 PUT 업로드 (브라우저 → S3)
      const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });
      if (!putRes.ok) throw new Error("S3 업로드 실패");
      console.log("🪣 S3 업로드 성공:", key);

      // (C) DB에 파일 메타데이터 저장 (리스트 렌더링용)
      const metaRes = await api.post("/files", {
        key,                       // S3 객체 키(예: uploads/123abc-test.png)
        originalName: file.name,   // 원본 파일명
        contentType: file.type,    // MIME
        size: file.size,           // 바이트
        title,                     // 사용자 입력 title
        description: desc          // 사용자 입력 description
      });
      console.log("📝 DB 저장 성공:", metaRes.data);

      // (D) 완료 처리 (상위 컴포넌트에 새로고침 알림 등)
      onDone?.();
      setTitle("");
      setDesc("");
      setFile(null);
      console.log("🎉 업로드 완료");
    } catch (error) {
      console.error("❌ 업로드 에러:", error);
      alert("업로드에 실패했습니다. 콘솔을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-list" onSubmit={upload}>
      {/* 파일 선택: 파일이 선택되면 file 상태에 보관 */}
      <input
        type="file"
        className="file-btn"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        accept="image/*"                // 옵션: 이미지만
      />

      {/* 텍스트 입력 묶음 */}
      <div className="left">
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />

        {/* 업로드 버튼: 진행 중이면 비활성화 */}
        <button type="submit" className="upload-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
