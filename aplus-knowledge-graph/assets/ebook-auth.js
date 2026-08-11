(function () {
  const AUTH_KEY = "hxlc_ebook_auth_v1";
  const USERNAME = "ISO";
  const PASSWORD = "17996";
  const currentScript = document.currentScript;
  const logoUrl = currentScript
    ? new URL("applus-logo.png", currentScript.src).href
    : "../../assets/applus-logo.png";

  function unlock() {
    document.body.classList.add("auth-unlocked");
    const panel = document.querySelector(".ebook-login-gate");
    if (panel) panel.remove();
    addLogoutButton();
  }

  function addLogoutButton() {
    const topbar = document.querySelector(".ebook-topbar");
    if (!topbar || document.querySelector(".ebook-logout")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ebook-logout";
    button.textContent = "退出登录";
    button.addEventListener("click", function () {
      window.sessionStorage.removeItem(AUTH_KEY);
      window.location.reload();
    });
    topbar.appendChild(button);
  }

  function showLogin() {
    document.body.classList.remove("auth-unlocked");
    if (document.querySelector(".ebook-login-gate")) return;

    const gate = document.createElement("div");
    gate.className = "ebook-login-gate";
    gate.innerHTML = `
      <form class="ebook-login-card" autocomplete="off">
        <img src="${logoUrl}" alt="北京艾普拉斯检验认证 Logo" />
        <span>受控技术文件</span>
        <h1>请登录后查看电子书全文</h1>
        <p>作业指导书及后续电子书内容需通过内部账号验证后浏览。</p>
        <label>
          <small>用户名</small>
          <input name="username" type="text" autocomplete="username" required />
        </label>
        <label>
          <small>密码</small>
          <input name="password" type="password" autocomplete="current-password" required />
        </label>
        <div class="ebook-login-error" aria-live="polite"></div>
        <button type="submit">登录查看</button>
      </form>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("form");
    const error = gate.querySelector(".ebook-login-error");
    const username = gate.querySelector('input[name="username"]');
    username.focus();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const inputUser = String(data.get("username") || "").trim();
      const inputPass = String(data.get("password") || "");
      if (inputUser === USERNAME && inputPass === PASSWORD) {
        window.sessionStorage.setItem(AUTH_KEY, "ok");
        unlock();
        return;
      }
      error.textContent = "用户名或密码不正确";
      form.classList.add("shake");
      window.setTimeout(() => form.classList.remove("shake"), 240);
    });
  }

  if (window.sessionStorage.getItem(AUTH_KEY) === "ok") {
    unlock();
  } else {
    showLogin();
  }
})();

