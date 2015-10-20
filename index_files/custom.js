(function() {
  var Firefly, TwoPI, alive_fireflies, canvas, center_x, center_y, colors, ctx, dt, fireflies, h, isOnHeart, last, last_emit, max_distance, max_fireflies, min_distance, now, render, w;

  TwoPI = Math.PI * 2;

  w = window.innerWidth;

  h = window.innerHeight;

  center_x = w / 2;

  center_y = h / 2;

  colors = ['#FFFFFF', '#FF4FA7', '#60EEE0', '#F12222', '#F44FB6', '#E89426', '#6BAF20'];

  max_distance = Math.abs(Math.max(center_x, center_y));

  min_distance = Math.abs(Math.min(center_x, center_y));

  Firefly = function() {
    var random_angle;
    this.velocity = 0;
    random_angle = Math.random() * TwoPI;
    this.x = center_x + Math.sin(random_angle) * (Math.random() * (max_distance - min_distance) + min_distance);
    this.y = center_y + Math.cos(random_angle) * (Math.random() * (max_distance - min_distance) + min_distance);
    this.angle_of_attack = Math.atan2(this.y - center_y, this.x - center_x);
    this.vel = (Math.random() * 5) + 7;
    this.color = colors[~~(colors.length * Math.random())];
    this.xvel = this.vel * Math.cos(this.angle_of_attack);
    this.yvel = this.vel * Math.sin(this.angle_of_attack);
    this.size = Math.random() * 2;
    this.size += 2;
    return this.phase_diff = Math.random() * TwoPI;
  };

  Firefly.prototype.move = function(dt) {
    if (isOnHeart(this.x, this.y)) {
      this.size -= 0.001;
      return;
    }
    dt *= 3.2;
    this.x += this.xvel * dt;
    return this.y += this.yvel * dt;
  };

  Firefly.prototype.render = function(ctx, now) {
    if (this.size < 1) {
      return;
    }
    ctx.globalAlpha = Math.max(Math.abs(Math.sin((now + this.phase_diff) / (~~(this.size * 100)))), 0.05);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, TwoPI, false);
    ctx.closePath();
    return ctx.fill();
  };

  max_fireflies = 500;

  canvas = document.getElementById('can');

  ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  fireflies = [];

  last = Date.now();

  dt = 0;

  now = 0;

  alive_fireflies = 0;

  last_emit = 0;

  (render = function() {
    now = Date.now();
    dt = (last - now) / 500;
    last = now;
    ctx.clearRect(0, 0, w, h);
    fireflies.forEach(function(f) {
      f.move(dt);
      return f.render(ctx, now);
    });
    fireflies = fireflies.filter(function(f) {
      return f.size > 1;
    });
    alive_fireflies = fireflies.length;
    if (alive_fireflies < max_fireflies && last_emit - now < - 100) {
      fireflies.push(new Firefly);
      last_emit = now;
    }
    return requestAnimationFrame(render);
  })();

  isOnHeart = function(x, y) {
    var x2, y2;
    x = ((x - center_x) / (min_distance * 1.2)) * 1.8;
    y = ((y - center_y) / min_distance) * -1.8;
    x2 = x * x;
    y2 = y * y;
    return Math.pow(x2 + y2 - 1, 3) - (x2 * (y2 * y)) <= 0;
  };

}).call(this);

