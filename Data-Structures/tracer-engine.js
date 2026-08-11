/* ============================================================
   CodeBhavya Shared Program Tracer Engine
   ------------------------------------------------------------
   One reusable execution engine for all program tracers.
   Each algorithm supplies only:
     - program: source-code lines
     - steps: execution steps
     - variables: which state values to show
     - optional renderArray / renderExtra callbacks
   ============================================================ */

window.CodeBhavyaTracer = (() => {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function create(config) {
    const api = {
      current: 0,
      state: {},
      timer: null,

      el(name) {
        const id = config.ids[name];
        return id ? document.getElementById(id) : null;
      },

      init() {
        this.current = 0;
        this.state = typeof config.initialState === "function"
          ? config.initialState()
          : {};
        this.render();
        return this;
      },

      toggle() {
        const box = this.el("box");
        if (!box) return;
        box.hidden = !box.hidden;
        if (!box.hidden) this.render();
      },

      applyThrough(count) {
        this.state = typeof config.initialState === "function"
          ? config.initialState()
          : {};

        for (let i = 0; i < count; i++) {
          config.steps[i].run(this.state, this);
        }
      },

      activeLine() {
        if (this.current === 0) {
          return config.startLine ?? config.steps[0]?.line ?? 0;
        }
        return config.steps[Math.min(this.current - 1, config.steps.length - 1)].line;
      },

      currentStep() {
        if (this.current === 0) {
          return {
            explain: config.startMessage || "Press Next to start executing the program.",
            op: ""
          };
        }
        return config.steps[Math.min(this.current - 1, config.steps.length - 1)];
      },

      renderCode() {
        const code = this.el("code");
        if (!code) return;

        const active = this.activeLine();

        code.innerHTML = config.program.map((line, index) => {
          const isActive = index === active;
          return `<span class="${config.codeLineClass || "cb-binary-code-line"} ${isActive ? "active" : ""}">${isActive ? "👉 " : "   "}${escapeHtml(line)}</span>`;
        }).join("");

        requestAnimationFrame(() => {
          const activeEl = code.querySelector("." + (config.codeLineClass || "cb-binary-code-line") + ".active");
          if (!activeEl) return;

          const activeTop = activeEl.offsetTop - code.offsetTop;
          const target = activeTop - (code.clientHeight / 2) + (activeEl.offsetHeight / 2);
          const maxScroll = Math.max(0, code.scrollHeight - code.clientHeight);
          code.scrollTop = Math.max(0, Math.min(target, maxScroll));
        });
      },

      renderVariables() {
        const target = this.el("vars");
        if (!target) return;

        const entries = typeof config.variables === "function"
          ? config.variables(this.state, this)
          : [];

        target.innerHTML = entries.length
          ? entries.map(([name, value]) =>
              `<div class="${config.variableClass || "cb-binary-var"}">
                <strong>${escapeHtml(name)}</strong>
                <span>${escapeHtml(value)}</span>
              </div>`
            ).join("")
          : `<div class="${config.variableClass || "cb-binary-var"}"><strong>State</strong><span>Not started</span></div>`;
      },

      render() {
        this.renderCode();

        const step = this.currentStep();
        const explain = this.el("explain");
        const operation = this.el("operation");
        const stack = this.el("stack");
        const output = this.el("output");

        if (explain) explain.textContent = step.explain || "";
        if (operation) {
          operation.innerHTML = step.op
            ? `<strong>⚡ Current operation:</strong> ${escapeHtml(step.op)}`
            : "";
        }

        this.renderVariables();

        if (stack) {
          const stackValues = typeof config.stack === "function"
            ? config.stack(this.state, this)
            : (this.state.callStack || []);

          stack.textContent = stackValues.length
            ? stackValues.join("\n")
            : (config.emptyStackText || "No active function call.");
        }

        if (output) {
          output.textContent = typeof config.output === "function"
            ? config.output(this.state, this)
            : (this.state.output ?? "No output yet.");
        }

        if (typeof config.renderArray === "function") {
          config.renderArray(this.state, this, escapeHtml);
        }

        if (typeof config.renderExtra === "function") {
          config.renderExtra(this.state, this, escapeHtml);
        }

        const completed = this.current >= config.steps.length;
        const next = this.el("next");
        const auto = this.el("auto");
        const status = this.el("status");

        if (next) {
          next.disabled = completed;
          next.textContent = completed ? "✓ Completed" : "Next →";
        }

        if (auto) auto.disabled = completed || !!this.timer;

        if (status) {
          status.textContent = completed
            ? "✓ Program execution completed. Press Reset to run again."
            : `Step ${this.current} of ${config.steps.length}`;
        }
      },

      next() {
        if (this.current >= config.steps.length) return;
        config.steps[this.current].run(this.state, this);
        this.current++;
        this.render();
      },

      prev() {
        if (this.current <= 0) return;
        this.current--;
        this.applyThrough(this.current);
        this.render();
      },

      reset() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }

        this.current = 0;
        this.state = typeof config.initialState === "function"
          ? config.initialState()
          : {};
        this.render();

        const code = this.el("code");
        if (code) {
          requestAnimationFrame(() => {
            code.scrollTo({ top: 0, left: 0, behavior: "auto" });
          });
        }
      },

      autoRun() {
        if (this.timer || this.current >= config.steps.length) return;

        this.timer = setInterval(() => {
          if (this.current >= config.steps.length) {
            clearInterval(this.timer);
            this.timer = null;
            this.render();
            return;
          }

          this.next();

          if (this.current >= config.steps.length) {
            clearInterval(this.timer);
            this.timer = null;
            this.render();
          }
        }, config.autoRunDelay || 900);

        this.render();
      }
    };

    api.init();
    return api;
  }

  return { create, escapeHtml };
})();
