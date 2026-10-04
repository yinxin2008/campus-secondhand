/* ===== 交互层：页内路由 / 搜索筛选 / 详情 / 发布 / 我的发布 ===== */

const STORAGE_KEY = 'secondhand_user_items';

const state = {
  keyword: '',
  category: 'all'
};

let myItems = loadMy();
let pendingImg = null;

/* ---------- 工具函数 ---------- */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function catById(id) {
  return CATEGORIES.find(function (c) { return c.id === id; }) || CATEGORIES[5];
}

function catName(id) {
  return catById(id).name;
}

function catColor(id) {
  return catById(id).color;
}

function catDefaultImg(id) {
  return catById(id).img;
}

function loadMy() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function saveMy() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myItems));
  } catch (e) {
    toast('本地存储空间不足，发布未保存');
  }
}

function allItems() {
  return MOCK_ITEMS.concat(myItems);
}

function findItem(id) {
  const list = allItems();
  for (let i = 0; i < list.length; i += 1) {
    if (String(list[i].id) === String(id)) return list[i];
  }
  return null;
}

function priceText(price) {
  return Number(price).toFixed(Number(price) % 1 === 0 ? 0 : 2);
}

let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
}

/* ---------- 视图切换 ---------- */

function showView(route) {
  document.querySelectorAll('.view').forEach(function (v) {
    v.hidden = v.dataset.route !== route;
  });
  window.scrollTo(0, 0);
}

function updateTab(path) {
  document.querySelectorAll('.tab-item').forEach(function (t) {
    const target = t.dataset.tab === 'publish' ? '/publish' : '/home';
    t.classList.toggle('active', path === target);
  });
}

function router() {
  const hash = location.hash || '#/home';
  const clean = hash.indexOf('#') === 0 ? hash.slice(1) : hash;
  const parts = clean.split('?');
  const path = parts[0] || '/home';
  const query = new URLSearchParams(parts[1] || '');

  if (path === '/detail') {
    showView('detail');
    renderDetail(query.get('id'));
  } else if (path === '/publish') {
    showView('publish');
    renderMyList();
  } else {
    showView('home');
  }
  updateTab(path);
}

/* ---------- 首页：分类条 + 商品网格 ---------- */

function renderCategoryBar() {
  const bar = document.getElementById('categoryBar');
  const allChip =
    '<button type="button" class="cat-chip' + (state.category === 'all' ? ' active' : '') +
    '" data-cat="all" style="' + (state.category === 'all' ? 'background:#1E6B4F;border-color:#1E6B4F;color:#fff;' : '') + '">' +
    '<span class="cat-dot" style="background:#1E6B4F"></span>全部</button>';

  const chips = CATEGORIES.map(function (c) {
    const active = state.category === c.id;
    return (
      '<button type="button" class="cat-chip' + (active ? ' active' : '') + '" data-cat="' + c.id + '"' +
      (active ? ' style="background:' + c.color + ';border-color:' + c.color + ';color:#fff;"' : '') + '>' +
      '<span class="cat-dot" style="background:' + c.color + '"></span>' + c.name + '</button>'
    );
  }).join('');

  bar.innerHTML = allChip + chips;

  bar.querySelectorAll('.cat-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.category = chip.dataset.cat;
      renderCategoryBar();
      renderGrid();
    });
  });
}

function cardHTML(item) {
  const cat = catById(item.category);
  const mine = item.isMine ? '<span class="mine-sticker">我发布的</span>' : '';
  return (
    '<article class="item-card" data-id="' + item.id + '">' +
      '<img class="item-thumb" src="' + item.img + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<span class="cat-sticker" style="background:' + cat.color + '">' + cat.name + '</span>' +
      '<span class="price-sticker">&yen;' + priceText(item.price) + '<small> 元</small></span>' +
      '<div class="item-body">' +
        '<h3 class="item-title">' + escapeHtml(item.title) + '</h3>' +
        '<div class="item-meta"><span>' + escapeHtml(item.dorm) + '</span><span>' + escapeHtml(item.time) + '</span></div>' +
      '</div>' +
      mine +
    '</article>'
  );
}

function renderGrid() {
  const kw = state.keyword.trim().toLowerCase();
  const list = allItems().filter(function (it) {
    const okCat = state.category === 'all' || it.category === state.category;
    const okKw = !kw ||
      it.title.toLowerCase().indexOf(kw) !== -1 ||
      (it.desc || '').toLowerCase().indexOf(kw) !== -1 ||
      catName(it.category).toLowerCase().indexOf(kw) !== -1;
    return okCat && okKw;
  });

  const grid = document.getElementById('itemGrid');
  const empty = document.getElementById('emptyState');

  if (!list.length) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.innerHTML = list.map(cardHTML).join('');

  grid.querySelectorAll('.item-card').forEach(function (card) {
    card.addEventListener('click', function () {
      location.hash = '#/detail?id=' + card.dataset.id;
    });
  });
}

/* ---------- 详情 ---------- */

function renderDetail(id) {
  const wrap = document.getElementById('detailContent');
  const item = findItem(id);

  if (!item) {
    wrap.innerHTML =
      '<div class="empty"><p class="empty-title">物品不存在或已下架</p>' +
      '<p class="empty-desc">可能已经被它的主人收回了。</p>' +
      '<a class="btn btn-primary" href="#/home">回到首页</a></div>';
    return;
  }

  item.views = (item.views || 0) + 1;
  const cat = catById(item.category);
  const mineTag = item.isMine ? '<span class="tag tag-ghost">我发布的</span>' : '';

  wrap.innerHTML =
    '<div class="detail-card">' +
      '<div class="detail-media">' +
        '<img class="detail-img" src="' + item.img + '" alt="' + escapeHtml(item.title) + '">' +
        '<span class="detail-price">&yen;' + priceText(item.price) + '<small> 元</small></span>' +
      '</div>' +
      '<div class="detail-info">' +
        '<div class="detail-tags">' +
          '<span class="tag" style="background:' + cat.color + '">' + cat.name + '</span>' +
          '<span class="tag tag-ghost">' + escapeHtml(item.condition || '八成新') + '</span>' +
          mineTag +
        '</div>' +
        '<h2 class="detail-title">' + escapeHtml(item.title) + '</h2>' +
        '<p class="detail-desc">' + escapeHtml(item.desc || '暂无描述') + '</p>' +
        '<div class="seller-card">' +
          '<span class="seller-avatar" style="background:' + cat.color + '">' + escapeHtml((item.seller || item.contact || '同').slice(0, 1)) + '</span>' +
          '<div class="seller-info">' +
            '<span class="seller-name">' + escapeHtml(item.seller || item.contact || '发布者') + '</span>' +
            '<span class="seller-meta">' + escapeHtml(item.dorm || '宿舍待补充') + ' · ' + escapeHtml(item.time || '刚刚') + ' · ' + item.views + ' 次浏览</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

/* ---------- 发布 ---------- */

function initCategorySelect() {
  const sel = document.getElementById('pCategory');
  CATEGORIES.forEach(function (c) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

function bindPublishForm() {
  const form = document.getElementById('publishForm');
  const fileInput = document.getElementById('pImage');
  const preview = document.getElementById('imgPreview');

  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast('图片超过 1MB，将使用分类默认图');
      fileInput.value = '';
      preview.hidden = true;
      pendingImg = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = function () {
      pendingImg = reader.result;
      preview.src = reader.result;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('pTitle').value.trim();
    const category = document.getElementById('pCategory').value;
    const price = parseFloat(document.getElementById('pPrice').value);
    const condition = document.getElementById('pCondition').value;
    const desc = document.getElementById('pDesc').value.trim();
    const contact = document.getElementById('pContact').value.trim();
    const dorm = document.getElementById('pDorm').value.trim();

    if (!title) return toast('请填写物品名称');
    if (!category) return toast('请选择分类');
    if (!(price > 0) || price > 99999) return toast('请填写正确的价格');
    if (!contact) return toast('请填写联系人');
    if (!dorm) return toast('请填写宿舍信息');

    const item = {
      id: 'u' + Date.now(),
      title: title,
      price: price,
      category: category,
      condition: condition,
      desc: desc || '暂无描述',
      contact: contact,
      dorm: dorm,
      img: pendingImg || catDefaultImg(category),
      time: '刚刚',
      views: 0,
      isMine: true
    };

    myItems.unshift(item);
    saveMy();

    form.reset();
    pendingImg = null;
    preview.hidden = true;

    toast('发布成功，已展示在首页');
    setTimeout(function () { location.hash = '#/home'; }, 650);
  });
}

/* ---------- 我的发布 ---------- */

function renderMyList() {
  const list = document.getElementById('myList');
  const empty = document.getElementById('myEmpty');

  if (!myItems.length) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  list.innerHTML = myItems.map(function (it) {
    return (
      '<div class="my-row">' +
        '<img class="my-thumb" src="' + it.img + '" alt="' + escapeHtml(it.title) + '">' +
        '<div class="my-body">' +
          '<p class="my-title">' + escapeHtml(it.title) + '</p>' +
          '<p class="my-meta">' + catName(it.category) + ' · ' + escapeHtml(it.time) + ' · ' + escapeHtml(it.dorm) + '</p>' +
        '</div>' +
        '<span class="my-price">&yen;' + priceText(it.price) + '</span>' +
        '<button class="btn-del" type="button" data-del="' + it.id + '">删除</button>' +
      '</div>'
    );
  }).join('');

  list.querySelectorAll('.btn-del').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const ok = window.confirm('确定删除这件闲置吗？删除后不可恢复。');
      if (!ok) return;
      const id = btn.dataset.del;
      myItems = myItems.filter(function (it) { return String(it.id) !== String(id); });
      saveMy();
      renderMyList();
      toast('已删除');
    });
  });
}

/* ---------- 搜索 ---------- */

function bindSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', function () {
    state.keyword = input.value;
    renderGrid();
  });
}

/* ---------- 启动 ---------- */

function init() {
  initCategorySelect();
  bindSearch();
  bindPublishForm();

  const backBtn = document.getElementById('backBtn');
  backBtn.addEventListener('click', function () { location.hash = '#/home'; });

  renderCategoryBar();
  renderGrid();
  window.addEventListener('hashchange', router);
  router();
}

document.addEventListener('DOMContentLoaded', init);
