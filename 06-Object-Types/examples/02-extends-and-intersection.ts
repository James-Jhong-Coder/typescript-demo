// 範例：extends 擴展 & 交集型別
// 執行方式：tsc --strict 02-extends-and-intersection.ts && node 02-extends-and-intersection.js

// === extends 繼承 ===
interface BasicAddress {
  street: string;
  city: string;
  country: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}

const office: AddressWithUnit = {
  street: "信義路五段7號",
  city: "台北市",
  country: "台灣",
  unit: "89樓",
};

console.log(`地址: ${office.city} ${office.street} ${office.unit}`);

// === 多重繼承 ===
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface Draggable {
  drag: () => void;
}

// 同時繼承三個 interface
interface DraggableColorfulCircle extends Colorful, Circle, Draggable {}

const widget: DraggableColorfulCircle = {
  color: "red",
  radius: 50,
  drag: () => console.log("拖曳中..."),
};

console.log(`\n圓形: color=${widget.color}, radius=${widget.radius}`);
widget.drag();

// === 交集型別（Intersection） ===
type ColorfulCircle = Colorful & Circle;

function draw(shape: ColorfulCircle) {
  console.log(`\n繪製 ${shape.color} 圓形，半徑 ${shape.radius}`);
}

draw({ color: "blue", radius: 30 });
