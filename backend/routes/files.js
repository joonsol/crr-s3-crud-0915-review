import { Router } from 'express';
import { nanoid } from 'nanoid';

import FileItem from '../models/FileItem.js';
import { presignGet, presignPut, deleteObject } from '../src/s3.js';

const router = Router()

router.post('/presign', async (req, res) => {
  try {
    const { filename, contentType } = req.body;

    // 필수 값 확인
    if (!filename || !contentType) {
      return res.status(400).json({ error: "filename/contentType 필수 입니다." });
    }

    // S3에 저장할 고유 key 생성 
    // nanoid는 고유한 ID 문자열을 생성해주는 라이브러리
    const key = `uploads/${Date.now()}-${nanoid(6)}-${filename}`;


    // presigned URL 발급
    const url = await presignPut(key, contentType);

    res.json({ url, key })
  } catch (error) {
    console.error("❌ presign 에러:", error);
    res.status(500).json({ error: "프리사인드 URL 생성에 실패했습니다" });
  }
})


// 파일 메타데이터 저장 API
router.post("/", async (req, res) => {
  try {
    // 요청에서 메타데이터 꺼내오기
    const {
      key,
      originalName,
      contentType,
      size,
      title = "",
      description = ""
    } = req.body;

    // DB에 새로운 문서 생성
    const doc = await FileItem.create({
      key,           // S3에 저장된 파일의 고유 key
      originalName,  // 사용자가 업로드한 원래 파일명
      contentType,   // 파일의 MIME 타입
      size,          // 파일 크기 (바이트 단위)
      title,         // 사용자가 입력한 제목
      description    // 사용자가 입력한 설명
    });

    // 성공 응답
    res.status(201).json({ message: "S3 메타데이터 저장 완료", doc });
  } catch (error) {
    console.error("❌ 메타데이터 저장 에러:", error);
    res.status(500).json({ error: "메타데이터 저장 실패" });
  }
});


export default router;