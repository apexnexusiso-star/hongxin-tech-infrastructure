(function () {
  const message = "该文件为受控内部资料，已限制复制、下载和打印。";

  function notify() {
    let box = document.querySelector(".protection-toast");
    if (!box) {
      box = document.createElement("div");
      box.className = "protection-toast";
      document.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.add("show");
    window.clearTimeout(box._timer);
    box._timer = window.setTimeout(() => box.classList.remove("show"), 1800);
  }

  function block(event) {
    event.preventDefault();
    event.stopPropagation();
    notify();
    return false;
  }

  document.addEventListener("contextmenu", block);
  document.addEventListener("copy", block);
  document.addEventListener("cut", block);
  document.addEventListener("dragstart", block);

  document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();
    const withCtrl = event.ctrlKey || event.metaKey;
    if (
      (withCtrl && ["c", "x", "s", "p", "a"].includes(key)) ||
      event.key === "PrintScreen"
    ) {
      block(event);
    }
  });
})();
