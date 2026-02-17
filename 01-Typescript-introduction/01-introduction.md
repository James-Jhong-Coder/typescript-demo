# The TypeScript Handbook

## 關於本手冊

在被引入程式設計社群超過 20 年後，JavaScript 現在已是有史以來最廣泛使用的跨平台語言之一。JavaScript 最初是一個用於為網頁添加簡單互動效果的小型腳本語言，如今已經成長為各種規模的前端和後端應用程式的首選語言。雖然用 JavaScript 編寫的程式在大小、範圍和複雜度上都有巨大的增長，但 JavaScript 語言表達不同程式碼單元之間關係的能力卻沒有跟上。再加上 JavaScript 相當特殊的執行時語義，這種語言與程式複雜度之間的不匹配使得 JavaScript 開發成為一項難以大規模管理的任務。

程式設計師最常犯的錯誤類型可以被描述為**型別錯誤（type errors）**：在預期某種型別的值的地方使用了另一種型別的值。這可能是因為簡單的拼寫錯誤、未能理解函式庫的 API 介面、對執行時行為的錯誤假設，或其他錯誤。**TypeScript 的目標是成為 JavaScript 程式的靜態型別檢查器**——換句話說，它是一個在你的程式碼執行之前運行的工具（靜態的），確保程式的型別是正確的（型別檢查）。

## 開始使用

在開始學習 TypeScript 之前，建議你先具備 JavaScript 的基礎知識。TypeScript 並不會改變 JavaScript 的執行方式，因此如果你已經了解 JavaScript，你也會知道 TypeScript 本身實際上是如何運行的。

TypeScript Handbook 旨在成為一份向日常程式設計師全面解釋 TypeScript 的文件。你可以在左側導覽列中由上而下地閱讀本手冊。

每一章節或頁面都會讓你對所涉及的概念有一個深入的理解。TypeScript Handbook 不是完整的語言規範，但它旨在成為該語言所有功能和行為的全面指南。

完成本手冊的讀者應該能夠：

- 閱讀並理解常用的 TypeScript 語法和模式
- 解釋重要編譯器選項的效果
- 在大多數情況下正確預測型別系統的行為

## 手冊結構

本手冊分為兩個部分：

### The Handbook

TypeScript Handbook 旨在成為一份全面的文件，向日常程式設計師解釋 TypeScript。你可以在左側導覽中由上而下地閱讀本手冊。

主要章節包括：

- **The Basics** — TypeScript 中的日常型別
- **Narrowing** — 型別縮小（型別守衛）
- **More on Functions** — 關於函式的更多內容
- **Object Types** — 物件型別
- **Type Manipulation** — 從型別建立型別
- **Classes** — 類別
- **Modules** — 模組

### Reference

手冊之外還有 Reference 部分，旨在提供 TypeScript 各部分如何運作的更豐富理解。你可以從頭到尾閱讀它，但每個部分都旨在對單一概念提供更深入的解釋——這意味著沒有連續性的目標。

## 非目標（Non-Goals）

本手冊也旨在成為一份簡潔的文件，可以在幾個小時內輕鬆閱讀完畢。為了保持簡短，某些主題不會被涵蓋。

具體來說，本手冊並沒有完全介紹核心 JavaScript 基礎知識，例如函式、類別和閉包。在適當的地方，我們會包含背景閱讀的連結，你可以用來了解這些概念。

本手冊也不是要取代語言規範。在某些情況下，會跳過邊緣案例或行為的正式描述，轉而採用更高層次、更易於理解的解釋。相反，有單獨的參考頁面可以更精確和正式地描述 TypeScript 行為的許多方面。參考頁面不適合不熟悉 TypeScript 的讀者，因此它們可能使用你尚未閱讀過的進階術語或主題。

最後，本手冊不會涵蓋 TypeScript 如何與其他工具互動的內容，除非必要。像是如何使用 webpack、rollup、parcel、react、babel、closure、lerna、rush、bazel、preact、vue、angular、svelte、jquery、yarn、npm 等工具配置 TypeScript 的主題超出了本手冊的範圍——你可以在網路上的其他地方找到這些資源。
