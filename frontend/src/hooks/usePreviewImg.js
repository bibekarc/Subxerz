import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [imgUrls, setImgUrls] = useState([]);
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith("image/"));

    if (validImages.length === 0) {
      showToast("Invalid file type", "Please select image files only.", "error");
      return;
    }

    const newImgUrls = validImages.map(file => {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImgUrls)
      .then(urls => setImgUrls(prev => [...prev, ...urls]))
      .catch(() => showToast("Error", "Failed to load images", "error"));
  };

  return { handleImageChange, imgUrls, setImgUrls };
};

export default usePreviewImg;
