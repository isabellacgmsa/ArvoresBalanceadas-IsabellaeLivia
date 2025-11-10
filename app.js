function uid() {
  return "p_" + Math.random().toString(36).slice(2, 9);
}
function fmt(n) {
  return (n || 0).toFixed(2);
}
function escapeHtml(s) {
  return (s + "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}

class AVLNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.id = "n" + Math.random().toString(36).slice(2, 9);
  }
}
class AVLTree {
  constructor() {
    this.root = null;
    this.rotations = 0;
    this.lastOps = [];
  } // lastOps for animation/highlight
  getHeight(n) {
    return n ? n.height : 0;
  }
  updateHeight(n) {
    if (n)
      n.height = 1 + Math.max(this.getHeight(n.left), this.getHeight(n.right));
  }
  getBalance(n) {
    return n ? this.getHeight(n.left) - this.getHeight(n.right) : 0;
  }

  rotateRight(y) {
    this.rotations++;
    this.lastOps.push({ type: "rotR", node: y.key });
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }
  rotateLeft(x) {
    this.rotations++;
    this.lastOps.push({ type: "rotL", node: x.key });
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  insertNode(node, key, value) {
    if (!node) return new AVLNode(key, value);
    if (key < node.key) node.left = this.insertNode(node.left, key, value);
    else if (key > node.key)
      node.right = this.insertNode(node.right, key, value);
    else {
      node.value = value;
      return node;
    }

    this.updateHeight(node);
    const balance = this.getBalance(node);

    if (balance > 1 && key < node.left.key) return this.rotateRight(node);
    if (balance < -1 && key > node.right.key) return this.rotateLeft(node);
    if (balance > 1 && key > node.left.key) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && key < node.right.key) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }

  insert(key, value) {
    this.lastOps = [];
    this.root = this.insertNode(this.root, key, value);
  }

  inorder(node, visit) {
    if (!node) return;
    this.inorder(node.left, visit);
    visit(node);
    this.inorder(node.right, visit);
  }
  height() {
    return this.getHeight(this.root);
  }
}

const RED = 0,
  BLACK = 1;
class RBTNode {
  constructor(keyObj, value, nil) {
    this.keyObj = keyObj;
    this.value = value;
    this.left = nil;
    this.right = nil;
    this.parent = null;
    this.color = RED;
    this.id = "r" + Math.random().toString(36).slice(2, 9);
  }
}
class RedBlackTree {
  constructor() {
    this.nil = {
      color: BLACK,
      left: null,
      right: null,
      parent: null,
      keyObj: null,
      id: "nil",
    };
    this.root = this.nil;
    this.rotations = 0;
    this.lastOps = [];
  }

  cmp(a, b) {
    if (a.qty !== b.qty) return a.qty - b.qty;
    return a.name.localeCompare(b.name);
  }

  leftRotate(x) {
    this.rotations++;
    this.lastOps.push({ type: "rotL", node: x.keyObj ? x.keyObj.name : null });
    let y = x.right;
    x.right = y.left;
    if (y.left !== this.nil) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === null) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  rightRotate(y) {
    this.rotations++;
    this.lastOps.push({ type: "rotR", node: y.keyObj ? y.keyObj.name : null });
    let x = y.left;
    y.left = x.right;
    if (x.right !== this.nil) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent === null) this.root = x;
    else if (y === y.parent.right) y.parent.right = x;
    else y.parent.left = x;
    x.right = y;
    y.parent = x;
  }

  insert(keyObj, value) {
    const node = new RBTNode(keyObj, value, this.nil);
    let y = null;
    let x = this.root;
    while (x !== this.nil && x !== null) {
      y = x;
      const c = this.cmp(node.keyObj, x.keyObj);
      if (c < 0) x = x.left;
      else x = x.right;
    }
    node.parent = y;
    if (y === null) this.root = node;
    else {
      const c = this.cmp(node.keyObj, y.keyObj);
      if (c < 0) y.left = node;
      else y.right = node;
    }
    if (node.parent === null) {
      node.color = BLACK;
      return;
    }
    if (node.parent.parent === null) return;
    this.insertFix(node);
  }

  insertFix(k) {
    while (k.parent && k.parent.color === RED) {
      if (k.parent === k.parent.parent.left) {
        let u = k.parent.parent.right;
        if (u && u.color === RED) {
          k.parent.color = BLACK;
          u.color = BLACK;
          k.parent.parent.color = RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.right) {
            k = k.parent;
            this.leftRotate(k);
          }
          k.parent.color = BLACK;
          k.parent.parent.color = RED;
          this.rightRotate(k.parent.parent);
        }
      } else {
        let u = k.parent.parent.left;
        if (u && u.color === RED) {
          k.parent.color = BLACK;
          u.color = BLACK;
          k.parent.parent.color = RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.left) {
            k = k.parent;
            this.rightRotate(k);
          }
          k.parent.color = BLACK;
          k.parent.parent.color = RED;
          this.leftRotate(k.parent.parent);
        }
      }
      if (k === this.root) break;
    }
    this.root.color = BLACK;
  }

  traverseDesc(node, visit) {
    if (!node || node === this.nil) return;
    this.traverseDesc(node.right, visit);
    visit(node);
    this.traverseDesc(node.left, visit);
  }

  height() {
    function h(n, nil) {
      if (!n || n === nil) return 0;
      return 1 + Math.max(h(n.left, nil), h(n.right, nil));
    }
    return h(this.root, this.nil);
  }
}

const productsMap = new Map();
const LSKEY = "estoque_avl_rbt_v1";
let lastInsertOps = { avl: [], rbt: [] };

const nameIn = document.getElementById("name");
const priceIn = document.getElementById("price");
const qtyIn = document.getElementById("qty");
const addBtn = document.getElementById("addBtn");
const removeBtn = document.getElementById("removeBtn");
const searchBtn = document.getElementById("searchBtn");
const searchName = document.getElementById("searchName");
const searchRes = document.getElementById("searchRes");
const listAVLBtn = document.getElementById("listAVL");
const listRBTBtn = document.getElementById("listRBT");
const productTable = document.getElementById("productTable");
const countSpan = document.getElementById("count");
const lastActionSpan = document.getElementById("lastAction");
const avlSvg = document.getElementById("avlSvg");
const rbtSvg = document.getElementById("rbtSvg");
const avlHeightSpan = document.getElementById("avlHeight");
const rbtHeightSpan = document.getElementById("rbtHeight");
const avlRotSpan = document.getElementById("avlRot");
const rbtRotSpan = document.getElementById("rbtRot");
const quickMetrics = document.getElementById("quickMetrics");
const topNSelect = document.getElementById("topN");
const clearBtn = document.getElementById("clearBtn");
const seedBtn = document.getElementById("seedBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const playInsertAnim = document.getElementById("playInsertAnim");

function showListResult(title, list) {
  const listHtml = list
    .map(
      (p) => `
 <div>
 <b>${escapeHtml(p.name)}</b>: R$ ${fmt(p.price)}, Qtd: ${p.qty}
</div>
`
    )
    .join("");

  searchRes.innerHTML = `
<h4>${title}</h4>
 <div style="max-height: 200px; overflow-y: auto; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.08);">
${listHtml || '<span class="muted">Nenhum item encontrado.</span>'}
 </div>
`;
}

function saveLS() {
  const arr = Array.from(productsMap.values());
  localStorage.setItem(LSKEY, JSON.stringify(arr));
}
function loadLS() {
  const raw = localStorage.getItem(LSKEY);
  if (!raw) return;
  try {
    const arr = JSON.parse(raw);
    productsMap.clear();
    arr.forEach((p) => {
      productsMap.set(p.id, p);
    });
    renderProducts();
    rebuildAll();
  } catch (e) {
    console.warn("load err", e);
  }
}

function renderProducts() {
  countSpan.textContent = productsMap.size;
  let html = "";
  if (productsMap.size === 0)
    html = '<div class="muted">Sem produtos cadastrados.</div>';
  else {
    html =
      '<table><thead><tr><th>Nome</th><th>Preço</th><th>Qtd</th><th style="text-align:right">ID</th></tr></thead><tbody>';
    for (const p of productsMap.values()) {
      html += `<tr><td>${escapeHtml(p.name)}</td><td>R$ ${fmt(
        p.price
      )}</td><td>${p.qty}</td><td style="text-align:right" class="small">${
        p.id
      }</td></tr>`;
    }
    html += "</tbody></table>";
  }
  productTable.innerHTML = html;
}

addBtn.addEventListener("click", () => {
  const name = (nameIn.value || "").trim();
  const price = parseFloat(priceIn.value || 0);
  const qty = parseInt(qtyIn.value || 0, 10);
  if (!name) {
    alert("Nome obrigatório");
    return;
  }
  let existing = null;
  for (const p of productsMap.values())
    if (p.name.toLowerCase() === name.toLowerCase()) {
      existing = p;
      break;
    }
  if (existing) {
    existing.name = name;
    if (!isNaN(price)) existing.price = price;
    if (!isNaN(qty)) existing.qty = qty;
    lastActionSpan.textContent = `Atualizado ${name}`;
  } else {
    const id = uid();
    productsMap.set(id, {
      id,
      name,
      price: isNaN(price) ? 0 : price,
      qty: isNaN(qty) ? 0 : qty,
    });
    lastActionSpan.textContent = `Adicionado ${name}`;
  }
  saveLS();
  renderProducts();
  const { avlRes, rbtRes } = rebuildAll();
  lastInsertOps.avl = avlRes.treeOps;
  lastInsertOps.rbt = rbtRes.treeOps;
});

removeBtn.addEventListener("click", () => {
  const name = (nameIn.value || "").trim();
  if (!name) {
    alert("Informe o nome para remover");
    return;
  }
  let target = null;
  for (const [id, p] of productsMap.entries()) {
    if (p.name.toLowerCase() === name.toLowerCase()) {
      target = id;
      break;
    }
  }
  if (!target) {
    alert("Produto não encontrado");
    return;
  }
  productsMap.delete(target);
  saveLS();
  renderProducts();
  lastActionSpan.textContent = `Removido ${name}`;
  rebuildAll();
});

searchBtn.addEventListener("click", () => {
  const q = (searchName.value || "").trim();
  if (!q) {
    searchRes.textContent = "Informe nome para buscar";
    return;
  }
  let found = null;
  for (const p of productsMap.values())
    if (p.name.toLowerCase() === q.toLowerCase()) {
      found = p;
      break;
    }
  if (found)
    searchRes.innerHTML = `Encontrado: <b>${escapeHtml(
      found.name
    )}</b> — R$ ${fmt(found.price)}, qtd ${found.qty}`;
  else searchRes.textContent = "Não encontrado";
});

listAVLBtn.addEventListener("click", () => {
  const { avlObj } = rebuildAll();
  const productsList = [];

  avlObj.inorder(avlObj.root, (node) => {
    productsList.push(node.value);
  });
  showListResult("📋 Lista Completa (AVL - Nome Ascendente)", productsList);
  lastActionSpan.textContent = `Listados ${productsList.length} itens (AVL)`;
});

listRBTBtn.addEventListener("click", () => {
  const { rbtObj } = rebuildAll();
  const N = parseInt(topNSelect.value, 10);
  const topProducts = [];
  let count = 0;

  rbtObj.traverseDesc(rbtObj.root, (node) => {
    if (count < N) {
      topProducts.push(node.value);
      count++;
    }
  });
  showListResult(
    `🏆 Top ${N} Mais Estocados (RBT - Qtd Descendente)`,
    topProducts
  );
  lastActionSpan.textContent = `Listados Top ${N} itens (RBT)`;
});
exportBtn.addEventListener("click", () => {
  const arr = Array.from(productsMap.values());
  const blob = new Blob([JSON.stringify(arr, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "estoque.json";
  a.click();
  URL.revokeObjectURL(url);
});
importBtn.addEventListener("click", () => {
  const raw = prompt(
    "Cole o JSON do estoque aqui (array de objetos com id,name,price,qty)"
  );
  if (!raw) return;
  try {
    const arr = JSON.parse(raw);
    productsMap.clear();
    arr.forEach((p) => {
      if (!p.id) p.id = uid();
      productsMap.set(p.id, p);
    });
    saveLS();
    renderProducts();
    rebuildAll();
    lastActionSpan.textContent = "Import realizado";
  } catch (e) {
    alert("JSON inválido");
  }
});

seedBtn.addEventListener("click", () => {
  const demo = [
    ["Camiseta", 29.9, 25],
    ["Calça Jeans", 89.9, 12],
    ["Meias", 5.9, 100],
    ["Tênis", 199.9, 8],
    ["Boné", 39.9, 40],
    ["Moletom", 129.9, 7],
    ["Jaqueta", 249.9, 3],
    ["Camisa Polo", 79.9, 32],
    ["Bermuda", 49.9, 21],
    ["Mochila", 159.9, 14],
    ["Relógio", 499.9, 5],
    ["Luvas", 19.9, 50],
    ["Óculos", 129.9, 9],
    ["Cinto", 39.9, 11],
    ["Carteira", 59.9, 18],
  ];
  productsMap.clear();
  demo.forEach((it) => {
    const id = uid();
    productsMap.set(id, { id, name: it[0], price: it[1], qty: it[2] });
  });
  saveLS();
  renderProducts();
  rebuildAll();
  lastActionSpan.textContent = "Demo populada";
});
clearBtn.addEventListener("click", () => {
  if (!confirm("Limpar todo o estoque?")) return;
  productsMap.clear();
  localStorage.removeItem(LSKEY);
  renderProducts();
  rebuildAll();
  lastActionSpan.textContent = "Estoque limpo";
});

playInsertAnim.addEventListener("click", () => {
  animateOps();
});

function rebuildAll() {
  const avl = new AVLTree();
  const t0 = performance.now();
  for (const p of productsMap.values()) avl.insert(p.name, p);
  const t1 = performance.now();
  const avlRes = {
    avlObj: avl,
    timeMs: t1 - t0,
    rotations: avl.rotations,
    height: avl.height(),
    treeOps: avl.lastOps.slice(),
  };

  const rbt = new RedBlackTree();
  const r0 = performance.now();
  for (const p of productsMap.values())
    rbt.insert({ qty: p.qty, name: p.name }, p);
  const r1 = performance.now();
  const rbtRes = {
    rbtObj: rbt,
    timeMs: r1 - r0,
    rotations: rbt.rotations,
    height: rbt.height(),
    treeOps: rbt.lastOps.slice(),
  };

  avlHeightSpan.textContent = avlRes.height;
  rbtHeightSpan.textContent = rbtRes.height;
  avlRotSpan.textContent = avlRes.rotations;
  rbtRotSpan.textContent = rbtRes.rotations;

  quickMetrics.innerHTML = `
    <div class="metric"><strong>AVL tempo</strong><div class="small">${avlRes.timeMs.toFixed(
      3
    )} ms</div></div>
    <div class="metric"><strong>RBT tempo</strong><div class="small">${rbtRes.timeMs.toFixed(
      3
    )} ms</div></div>
    <div class="metric"><strong>Registros</strong><div class="small">${
      productsMap.size
    }</div></div>
  `;

  drawAVL(avl);
  drawRBT(rbt);

  return { avlRes, rbtRes, avlObj: avl, rbtObj: rbt };
}

function layoutTree(root, getLeft, getRight) {
  let positions = [];
  let x = 0;
  function dfs(node, depth) {
    if (!node) return;
    dfs(getLeft(node), depth + 1);
    positions.push({ node, depth, order: x++ });
    dfs(getRight(node), depth + 1);
  }
  dfs(root, 0);
  const W = 1200,
    H = 340;
  const maxDepth = positions.reduce((m, p) => Math.max(m, p.depth), 0);
  const levels = Math.max(1, maxDepth + 1);
  const xs = {};
  positions.forEach((p) => {
    xs[p.node.id] = ((p.order + 1) / (x + 1)) * (W - 80) + 40;
  });
  const ys = {};
  positions.forEach((p) => {
    ys[p.node.id] = (p.depth / levels) * (H - 60) + 30;
  });
  return { positions, xs, ys, W, H };
}

function drawAVL(avl) {
  while (avlSvg.firstChild) avlSvg.removeChild(avlSvg.firstChild);
  if (!avl.root) {
    avlSvg.setAttribute("viewBox", "0 0 1200 360");
    return;
  }
  const { positions, xs, ys, W, H } = layoutTree(
    avl.root,
    (n) => n.left,
    (n) => n.right
  );
  const idMap = {};
  positions.forEach((p) => (idMap[p.node.id] = p.node));

  positions.forEach((p) => {
    const n = p.node;
    if (n.left) {
      const x1 = xs[n.id],
        y1 = ys[n.id],
        x2 = xs[n.left.id],
        y2 = ys[n.left.id];
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1 + 12);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2 - 12);
      line.setAttribute("stroke", "rgba(255,255,255,0.06)");
      line.setAttribute("stroke-width", 2);
      avlSvg.appendChild(line);
    }
    if (n.right) {
      const x1 = xs[n.id],
        y1 = ys[n.id],
        x2 = xs[n.right.id],
        y2 = ys[n.right.id];
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1 + 12);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2 - 12);
      line.setAttribute("stroke", "rgba(255,255,255,0.06)");
      line.setAttribute("stroke-width", 2);
      avlSvg.appendChild(line);
    }
  });

  positions.forEach((p) => {
    const n = p.node;
    const cx = xs[n.id],
      cy = ys[n.id];
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${cx},${cy})`);
    g.setAttribute("data-id", n.id);
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", "linearGradient");
    circle.setAttribute("stroke", "rgba(255,255,255,0.06)");
    circle.setAttribute("stroke-width", 1.5);
    circle.style.fill = "rgba(124,58,237,0.12)";
    g.appendChild(circle);

    const txt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt1.setAttribute("x", 0);
    txt1.setAttribute("y", 4);
    txt1.setAttribute("text-anchor", "middle");
    txt1.textContent = n.key;
    g.appendChild(txt1);

    const small = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    small.setAttribute("x", 24);
    small.setAttribute("y", -26);
    small.setAttribute("width", 44);
    small.setAttribute("height", 18);
    small.setAttribute("rx", 6);
    small.setAttribute("fill", "rgba(0,0,0,0.25)");
    small.setAttribute("stroke", "rgba(255,255,255,0.03)");
    g.appendChild(small);

    const badge = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    badge.setAttribute("x", 46);
    badge.setAttribute("y", -12);
    badge.setAttribute("text-anchor", "middle");
    badge.setAttribute("font-size", "11");
    badge.textContent =
      n.value && n.value.qty !== undefined ? "q:" + n.value.qty : "";
    g.appendChild(badge);

    avlSvg.appendChild(g);
  });
}

function drawRBT(rbt) {
  while (rbtSvg.firstChild) rbtSvg.removeChild(rbtSvg.firstChild);
  if (!rbt.root || rbt.root === rbt.nil) {
    rbtSvg.setAttribute("viewBox", "0 0 1200 360");
    return;
  }

  const getLeft = (n) => (n && n.left !== rbt.nil ? n.left : null);
  const getRight = (n) => (n && n.right !== rbt.nil ? n.right : null);

  let positions = [];
  let x = 0;
  (function dfs(node, depth) {
    if (!node || node === rbt.nil) return;
    dfs(getLeft(node), depth + 1);
    positions.push({ node, depth, order: x++ });
    dfs(getRight(node), depth + 1);
  })(rbt.root, 0);

  const W = 1200,
    H = 340;
  const maxDepth = positions.reduce((m, p) => Math.max(m, p.depth), 0);
  const levels = Math.max(1, maxDepth + 1);
  const xs = {};
  positions.forEach((p) => {
    xs[p.node.id] = ((p.order + 1) / (x + 1)) * (W - 80) + 40;
  });
  const ys = {};
  positions.forEach((p) => {
    ys[p.node.id] = (p.depth / levels) * (H - 60) + 30;
  });

  positions.forEach((p) => {
    const n = p.node;
    if (n.left && n.left !== rbt.nil) {
      const x1 = xs[n.id],
        y1 = ys[n.id],
        x2 = xs[n.left.id],
        y2 = ys[n.left.id];
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1 + 12);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2 - 12);
      line.setAttribute("stroke", "rgba(255,255,255,0.05)");
      line.setAttribute("stroke-width", 2);
      rbtSvg.appendChild(line);
    }
    if (n.right && n.right !== rbt.nil) {
      const x1 = xs[n.id],
        y1 = ys[n.id],
        x2 = xs[n.right.id],
        y2 = ys[n.right.id];
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1 + 12);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2 - 12);
      line.setAttribute("stroke", "rgba(255,255,255,0.05)");
      line.setAttribute("stroke-width", 2);
      rbtSvg.appendChild(line);
    }
  });

  positions.forEach((p) => {
    const n = p.node;
    const cx = xs[n.id],
      cy = ys[n.id];
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${cx},${cy})`);
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("r", 20);
    circle.setAttribute("stroke", "rgba(255,255,255,0.06)");
    circle.setAttribute("stroke-width", 1.5);

    circle.style.fill =
      n.color === RED ? "rgba(239,68,68,0.88)" : "rgba(0,0,0,0.6)";
    g.appendChild(circle);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", 0);
    txt.setAttribute("y", 4);
    txt.setAttribute("text-anchor", "middle");
    txt.textContent = n.keyObj ? n.keyObj.qty + ":" + n.keyObj.name : "";
    g.appendChild(txt);
    rbtSvg.appendChild(g);
  });
}

function animateOps() {
  const avlOps = lastInsertOps.avl || [];
  const rbtOps = lastInsertOps.rbt || [];

  const avlNames = new Set(avlOps.map((o) => o.node).filter(Boolean));
  const rbtNames = new Set(rbtOps.map((o) => o.node).filter(Boolean));

  const flash = (svgEl, namesSet, color) => {
    if (namesSet.size === 0) {
      svgEl.style.transition = "box-shadow .2s";
      svgEl.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
      svgEl.style.boxShadow = "0 0 18px rgba(124,58,237,0.08)";
      setTimeout(() => (svgEl.style.boxShadow = "none"), 500);
      return;
    }
    const groups = svgEl.querySelectorAll("g");
    groups.forEach((g) => {
      const text = g.querySelector("text");
      if (!text) return;
      const txt = text.textContent || "";
      for (const name of namesSet) {
        if (txt.includes(name)) {
          const c = g.querySelector("circle");
          if (c) {
            const orig = c.style.fill;
            c.style.transition = "transform .18s, filter .18s";
            c.style.transform = "scale(1.12)";
            c.style.filter = "drop-shadow(0 6px 18px rgba(124,58,237,0.24))";
            setTimeout(() => {
              c.style.transform = "scale(1)";
              c.style.filter = "none";
            }, 700);
          }
        }
      }
    });
  };
  flash(avlSvg, avlNames, "#7c3aed");
  flash(rbtSvg, rbtNames, "#f43f5e");
}

loadLS();

renderProducts();
rebuildAll();

productTable.addEventListener("dblclick", (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = tr.querySelector(".small")
    ? tr.querySelector(".small").textContent
    : null;
  if (!id) return;
  const p = Array.from(productsMap.values()).find((x) => x.id === id);
  if (!p) return;
  nameIn.value = p.name;
  priceIn.value = p.price;
  qtyIn.value = p.qty;
});

[nameIn, priceIn, qtyIn].forEach((el) =>
  el.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") addBtn.click();
  })
);
