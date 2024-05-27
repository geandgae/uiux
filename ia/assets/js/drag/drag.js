"use strict";

// 일반
// document.addEventListener("DOMContentLoaded", () => {
//   // textcopy
//   const textContainer = document.getElementById('textContainer');

//   textContainer.addEventListener('mouseup', () => {
//     const selectedText = window.getSelection().toString().trim();
//     if (selectedText) {
//       navigator.clipboard.writeText(selectedText).then(() => {
//         console.log(`Copied to clipboard: ${selectedText}`);
//       }).catch(err => {
//         console.error('Failed to copy text: ', err);
//       });
//     }
//   });

//   // drag & drop
//   const source = document.getElementById("source");
//   const target = document.getElementById("target");

//   source.addEventListener("dragstart", (event) => {
//     event.dataTransfer.setData("text/plain", source.textContent);
//   });

//   target.addEventListener("dragover", (event) => {
//     event.preventDefault();
//   });

//   target.addEventListener("drop", (event) => {
//     event.preventDefault();
//     const data = event.dataTransfer.getData("text/plain");
//     target.textContent = data;
//   });
// });


// 드래그하면 복사 
// Function to handle text selection and copy to clipboard
// const handleTextSelection = (event) => {
//   const selectedText = window.getSelection().toString().trim();
//   if (selectedText) {
//     navigator.clipboard.writeText(selectedText).then(() => {
//       console.log(`Copied to clipboard: ${selectedText}`);
//     }).catch(err => {
//       console.error('Failed to copy text: ', err);
//     });
//   }
// };

// // Function to initialize the event listener
// const initializeTextCopyFeature = (elementId) => {
//   const element = document.getElementById(elementId);
//   if (element) {
//     element.addEventListener('mouseup', handleTextSelection);
//   } else {
//     console.error(`Element with id ${elementId} not found.`);
//   }
// };

// // Initialize the feature when DOM content is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   initializeTextCopyFeature('textContainer');
// });


// 드래그 후 토스트에서 기능 선택
// Function to handle text selection and copy to clipboard
const handleTextSelection = () => {
  const selectedText = window.getSelection().toString().trim();
  const copyButton = document.getElementById('copyButton');
  if (selectedText) {
    copyButton.classList.add("active");
    copyButton.onclick = () => {
      navigator.clipboard.writeText(selectedText).then(() => {
        console.log(`Copied to clipboard: ${selectedText}`);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    };
  } else {
    copyButton.classList.remove("active");
  }
};

// Function to initialize the event listeners
const initializeTextCopyFeature = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('selectionchange', handleTextSelection);
  } else {
    console.error(`Element with id ${elementId} not found.`);
  }
};

// Initialize the feature when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeTextCopyFeature('textContainer');
});