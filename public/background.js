// 添加 DOMContentLoaded 事件监听器来确保页面完全加载后执行脚本
document.addEventListener("DOMContentLoaded", function () {
  // 创建画布并设置其尺寸覆盖整个窗口
  const canvas = document.createElement("canvas");
  canvas.width = globalThis.innerWidth;
  canvas.height = globalThis.innerHeight;
  document.body.appendChild(canvas); // 将画布添加到文档体中

  const ctx = canvas.getContext("2d"); // 获取2D上下文
  const circles = []; // 存储所有圆环的数组
  const numCircles = 30; // 圆环数量
  const noiseScale = 0.005; // 噪声大小的比例因子

  // 定义圆环类
  class Circle {
    constructor(canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.x = canvasWidth / 2;
      this.y = canvasHeight / 2;
      this.size = Math.random() * 200 + 1; // 圆环大小，1到300之间随机
      this.noiseOffsetX = Math.random() * 1; // 噪声偏移量X
      this.noiseOffsetY = Math.random() * 4000; // 噪声偏移量Y
    }

    // 更新圆环位置的方法
    update(mouseX, mouseY) {
      const noiseX = Math.random() * this.canvasWidth;
      const noiseY = Math.random() * this.canvasHeight;
      this.x += (noiseX - this.x) * noiseScale;
      this.y += (noiseY - this.y) * noiseScale;

      this.x = lerp(this.x, mouseX - 200, 0.002); // 线性插值逼近鼠标位置
      this.y = lerp(this.y, mouseY - 200, 0.002);
    }

    // 显示圆环的方法
    display() {
      const alpha = (this.size - 5) / 295; // 计算透明度
      //const blue = (this.size - 5) / 295 * 155 + 100;
      ctx.fillStyle = `rgba(135, 46, 28, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // 初始化所有圆环
  for (let i = 0; i < numCircles; i++) {
    circles.push(new Circle(canvas.width, canvas.height));
  }

  let mouseX = 0, mouseY = 0; // 初始化鼠标位置

  // 监听鼠标移动事件
  document.addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  // 动画循环函数
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    circles.forEach((circle) => {
      circle.update(mouseX, mouseY);
      circle.display();
    });

    requestAnimationFrame(animate); // 请求下一帧动画
  }

  animate(); // 启动动画循环
});

// 线性插值函数
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}
