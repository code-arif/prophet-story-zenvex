import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Import TinyMCE core
import 'tinymce/tinymce';

// Import TinyMCE theme
import 'tinymce/themes/silver';

// Import TinyMCE icons
import 'tinymce/icons/default';

// Import TinyMCE models
import 'tinymce/models/dom';

// Import TinyMCE plugins
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';

// Import TinyMCE skins
import 'tinymce/skins/ui/oxide/skin.min.css';

const TinyMCEEditor = forwardRef(function TinyMCEEditor({ value, onChange, height = 400 }, ref) {
  const editorRef = useRef(null);

  // Get CSRF token from meta tag
  const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  };

  // Image upload handler
  const imageUploadHandler = (blobInfo, progress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/admin/media');

      // Add CSRF token
      xhr.setRequestHeader('X-CSRF-TOKEN', getCsrfToken());
      // Request JSON response
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progress((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            if (json.location) {
              resolve(json.location);
              return;
            }
          } catch (e) {
            reject({ message: 'Invalid response from server' });
            return;
          }
          reject({ message: 'No image location in response' });
        } else {
          let errorMessage = 'Upload failed: ' + xhr.status;
          try {
            const json = JSON.parse(xhr.responseText);
            if (json.message) errorMessage = json.message;
            if (json.errors?.file) errorMessage = json.errors.file[0];
          } catch {}
          reject({ message: errorMessage });
        }
      };

      xhr.onerror = () => {
        reject({ message: 'Image upload failed due to network error' });
      };

      xhr.send(formData);
    });
  };

  useImperativeHandle(ref, () => ({
    insertImage: (url) => {
      const ed = editorRef.current;
      if (!ed) return;
      try {
        ed.insertContent(`<img src="${url}" alt="" />`);
      } catch (e) {
        // ignore
      }
    },
    insertHtml: (html) => {
      const ed = editorRef.current;
      if (!ed) return;
      try {
        ed.insertContent(html);
      } catch (e) {
        // ignore
      }
    },
    getContent: () => (editorRef.current ? editorRef.current.getContent() : ''),
  }));

  return (
    <Editor
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(content) => onChange?.(content)}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic underline strikethrough | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'link image media | removeformat code fullscreen',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }',
        skin: false,
        content_css: false,
        promotion: false,
        branding: false,
        license_key: 'gpl',
        // Image upload settings
        images_upload_handler: imageUploadHandler,
        automatic_uploads: true,
        file_picker_types: 'image',
        // Allow pasting images
        paste_data_images: true,
      }}
    />
  );
});

export default TinyMCEEditor;
