import React from 'react'
import { useEffect, useState } from "react";
import api from "../api";
import "./style/FileList.scss"
const FileList = () => {
  return (
    <ul className="file-list">
      <li>
        <div>
          <h3>샘플 이미지</h3>
        </div>
        <img
          src="https://crr-s3-crud-0914.s3.ap-northeast-2.amazonaws.com/uploads/1757827267504-TB39Kn-test.png"
          alt="샘플 이미지"
          style={{ maxWidth: 200, display: "block" }}
        />
        <p>이것은 샘플 설명입니다.</p>
        <div className="btns-wrap">

        <a href="https://via.placeholder.com/800x400.png" target="_blank" rel="noreferrer">
          Open
        </a>
        <button style={{ marginLeft: 8 }}>Delete</button>
        </div>
      </li>

    </ul>

  )
}

export default FileList