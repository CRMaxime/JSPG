var canvas_element = document.getElementById("canvas");
canvas_element.width = window.innerWidth;
canvas_element.height = window.innerHeight;
window.onresize = function() {
    canvas_element.width = window.innerWidth;
    canvas_element.height = window.innerHeight;
}
var canvas = canvas_element.getContext("2d");
var particles = new Array();
var mouse = new Object();
mouse.down = false;
var gravity = 5;
var rebound = 6;
var edges = true;
var min_size = 1;
var max_size = 20;
var min_x = 0;
var max_x = 15;
var min_y = 0;
var max_y = 15;
var left = true;
var right = true;
var up = true;
var down = true;
var random = true;
var transparent = true;
var color = "#FF0000";
var bg_color = "#FFFFFF";
var shape = "CIRCLES";
var shapes = ["CIRCLES", "SQUARES", "LINES", "LETTERS"];
var spawn_rate = 6;
var lifespan = 100;
canvas.shadowBlur = 10;
var count = 0;
var time = new Date;
var oldtime = new Date().getTime();
var turbo = false;
var auto = false;
var code = "(){}</>+-=;0123abcd[]";
var code_words = [
    "if",
    "else",
    "var a;",
    "var b;",
    "var c",
    "a = true;",
    "a = false;",
    "b = 1;",
    "b = 4;",
    "b++;",
    "b--;",
    "c++;",
    "b < c",
    "<",
    ">",
    "{",
    "(",
    "}",
    ")",
    "[",
    "]"
];
var time_out;
var opened = false;

function open_settings() {
    if (!opened) {
        document
            .getElementById("panel")
            .style
            .right = 0;
        opened = true;
        document
            .getElementById("settings")
            .src = "close.png";
    } else {
        document
            .getElementById("panel")
            .style
            .right = "-350px";
        opened = false;
        document
            .getElementById("settings")
            .src = "settings.png";
    }
}

function rgba(hex) {
    return parseInt((hex.substr(1, 2)), 16) + "," + parseInt((hex.substr(3, 2)), 16) + "," + parseInt((hex.substr(5, 2)), 16);
}

function particle(x, y, shape) {
    this.x = x;
    this.y = y;
    this.shape = shape;
    if (this.shape == "RANDOM") 
        this.shape = shapes[Math.round(Math.random() * 3)];
    else if (this.shape == "LETTERS") 
        this.letter = String.fromCharCode(65 + Math.round(Math.random() * 50));
    else if (this.shape == "CODE") 
        this.letter = code.substr(Math.floor(Math.random() * code.length), 1);
    else if (this.shape == "CODING") 
        this.letter = code_words[Math.floor(Math.random() * code_words.length)];
    this.x_speed = min_x + Math.random() * (max_x - min_x);
    if ((left && !right) || (left && Math.random() > 0.5)) 
        this.x_speed = -this.x_speed;
    else if (!left && !right) 
        this.x_speed = 0;
    this.y_speed = min_y + Math.random() * (max_y - min_y);
    if ((up && !down) || (up && Math.random() > 0.5)) 
        this.y_speed = -this.y_speed;
    else if (!up && !down) 
        this.y_speed = 0;
    this.r = min_size + Math.random() * (max_size - min_size);
    this.w = this.r;
    this.alpha = transparent
        ? Math.random()
        : 1;
    // this.color = random ? rgba(all_colors[Math.round(Math.random() * all_colors.length - 1)]) :
    // rgba(color);
    this.color = color == "multi"
        ? (Math.round(Math.random() * 255)) + ',' + (Math.round(Math.random() * 255)) + ',' + (Math.round(Math.random() * 255))
        : rgba(color);
    this.age = 0;
    this.draw = function() {
        canvas.fillStyle = canvas.strokeStyle = "rgba(" + this.color + "," + this.alpha + ")";
        canvas.beginPath();
        if (this.shape == "CIRCLES") 
            canvas.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        else if (this.shape == "SQUARES") 
            canvas.rect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        else if (this.shape == "LINES") {
            canvas.lineWidth = this.w / 4;
            canvas.moveTo(this.x, this.y);
            canvas.lineTo(this.x + this.x_speed * 5, this.y + this.y_speed * 5);
            canvas.stroke();
            this.r = this.y_speed;
        } else if (this.shape == "LETTERS") {
            canvas.font = this.r + "pt Arial";
            canvas.fillText(this.letter, this.x, this.y);
        } else {
            canvas.font = this.r + "pt Monospace";
            canvas.fillText(this.letter, this.x, this.y);
        }
        canvas.fill();
        this.x += this.x_speed;
        this.y += this.y_speed;
        if (gravity) {
            this.y_speed += (gravity / 5);
            this.x_speed *= 0.99;
        }
        if (rebound) {
            if (this.x - this.r < 0) {
                this.x = this.r;
                this.x_speed = -this.x_speed;
            } else if (this.x + this.r > window.innerWidth) {
                this.x = window.innerWidth - this.r;
                this.x_speed = -this.x_speed;
            }
            if (this.y + this.r + 2 > window.innerHeight) {
                this.y = window.innerHeight - this.r;
                this.y_speed *= (0 - rebound / 10);
            }
        }
        if (turbo) {
            this.x_speed *= 1.05;
            this.y_speed *= 1.05;
        }
        this.age++;
        if ((lifespan < 100 && this.age > lifespan) || (this.y + this.r > window.innerHeight - 10 && Math.abs(this.y_speed) < 0.5)) 
            this.alpha -= 0.1;
        }
    }

function update() {
    window.requestAnimationFrame(update);
    canvas.clearRect(0, 0, canvas_element.width, canvas_element.height);
    count = particles.length;
    for (var p = 0; p < count; p++) 
        if (particles[p].y > window.innerHeight + 100 || particles[p].y < -200 || particles[p].x < -100 || particles[p].x > window.innerWidth + 100 || particles[p].alpha < 0.1) {
            particles.splice(p, 1);
            p--;
            count--;
        }
    else 
        particles[p].draw();
    if (mouse.down) 
        for (var s = 0; s < spawn_rate; s++) 
            particles.push(new particle(mouse.x, mouse.y, shape));
if (auto) 
        for (var s = 0; s < spawn_rate; s++) 
            particles.push(new particle(window.innerWidth / 2 - 155, window.innerHeight / 2, shape));
var s = count > 1
        ? 's'
        : '';
    document
        .getElementById("count")
        .textContent = count + " particle" + s;
    var time = new Date().getTime();
    document
        .getElementById("fps")
        .textContent = Math.round(1000 / (time - oldtime));
    oldtime = time;
}
var presets = new Array();
presets["DEFAULT"] = new Array("CIRCLES", 2, 20, 0, 15, 0, 15, true, true, true, true, 5, 6, "#FF0000", true, "#FFFFFF", 6, 100, false);
presets["INTERGALACTIC"] = new Array("LINES", 1, 20, 0, 10, 0, 10, true, true, true, true, 0, 0, "#ffffff", true, "#000000", 7, 100, true);
presets["FIREFLIES"] = new Array("CIRCLES", 0, 5, 0, 2, 0, 2, true, true, true, true, 0, 0, "#f1c232", true, "#20124d", 1, 28, false);
presets["BLOOD CELLS"] = new Array("CIRCLES", 8, 34, 0, 3, 0, 3, true, true, true, true, 0, 0, "#cc0000", true, "#ea9999", 1, 100, false);
presets["DISCO SNAKE"] = new Array("CIRCLES", 28, 28, 0, 15, 0, 15, false, false, false, false, 5, 6, "multi", false, "#ffe599", 6, 100, false);
presets["BOUNCY"] = new Array("CIRCLES", 5, 6, 11, 11, 11, 11, false, true, true, false, 5, 6, "#9900ff", true, "#f3f3f3", 3, 100, false);
presets["TRIPPY"] = new Array("SQUARES", 11, 50, 0, 15, 0, 15, true, true, true, true, 0, 0, "multi", false, "#ff00ff", 18, 100, false);
presets["FIREWORKS"] = new Array("LINES", 6, 17, 0, 10, 0, 10, true, true, true, true, 1, 0, "#1d21ae", false, "#000000", 18, 14, false, true);
presets["SPRINKLER"] = new Array("CIRCLES", 1, 2, 0, 7, 7, 13, true, true, true, false, 3, 0, "#0000ff", true, "#f3f3f3", 11, 100, false);
presets["POOL"] = new Array("CIRCLES", 23, 49, 0, 14, 0, 3, true, true, false, true, 1, 6, "#0000ff", true, "#9fc5e8", 6, 100, false);
presets["WATERFALL"] = new Array("LINES", 9, 28, 0, 5, 0, 15, true, true, false, true, 1, 3, "#6fa8dc", true, "#eeeeee", 15, 100, false);
presets["FREE WRITING"] = new Array("LETTERS", 10, 21, 6, 13, 0, 13, false, true, true, false, 5, 6, "#444444", true, "#f3f3f3", 7, 100, false);
presets["CODE"] = new Array("CODE", 12, 12, 0, 2, 0, 2, true, true, true, true, 0, 0, "#999999", false, "#f3f3f3", 2, 20, false);
presets["CODING"] = new Array("CODING", 8, 8, 0, 2, 1, 1, false, false, false, true, 0, 0, "#999999", false, "#f3f3f3", 1, 58, false)
presets["BRUSH"] = new Array("CIRCLES", 16, 16, 0, 0, 0, 0, false, false, false, false, 0, 6, "#444444", false, "#ffffff", 1, 100, false);
for (var name in presets) {
    var option = document.createElement("option");
    option.textContent = name;
    document
        .getElementById("presets")
        .appendChild(option);
}

function load(preset) {
    preset = presets[preset];
    if (preset == "DEFAULT") {
        random = true;
        $("#random").prop("checked", true);
    } else {
        random = false;
        $("#random").prop("checked", false);
    }
    shape = preset[0];
    $("#shape_selector").val(shape);
    min_size = preset[1];
    max_size = preset[2];
    $("#size_range").slider("values", [min_size, max_size]);
    min_x = preset[3];
    max_x = preset[4];
    $("#horizontal_range").slider("values", [min_x, max_x]);
    min_y = preset[5];
    max_y = preset[6];
    $("#vertical_range").slider("values", [min_y, max_y]);
    left = preset[7];
    $("#left").prop("checked", left);
    right = preset[8];
    $("#right").prop("checked", right);
    $("#horizontal").buttonset("refresh");
    up = preset[9];
    $("#up").prop("checked", up);
    down = preset[10];
    $("#down").prop("checked", down);
    $("#vertical").buttonset("refresh");
    gravity = preset[11];
    $("#gravity_slider").slider("value", gravity);
    rebound = preset[12];
    $("#rebound_slider").slider("value", rebound);
    color = preset[13];
    if (color == "multi") 
        $("#color_picker").css("background-image", "url(multicolor.png)");
    else {
        $("#color_picker").css("background-image", "none");
        $("#color_picker").css("background-color", color);
    }
    transparent = preset[14];
    $("#transparent").prop("checked", transparent);
    bg_color = preset[15];
    $("body").css("background-color", bg_color);
    $("#bg_color_picker").css("background-color", bg_color);
    spawn_rate = preset[16];
    $("#spawn_slider").slider("value", spawn_rate);
    lifespan = preset[17];
    $("#lifespan_slider").slider("value", lifespan);
    turbo = preset[18];
    $("#turbo").prop("checked", turbo);
    random = preset[19];
    $("#random").prop("checked", random);
}

function save() {
    alert('presets[""] = new Array("' + shape + '", ' + min_size + ', ' + max_size + ', ' + min_x + ', ' + max_x + ', ' + min_y + ', ' + max_y + ', ' + left + ', ' + right + ', ' + up + ', ' + down + ', ' + gravity + ', ' + rebound + ', "' + color + '", ' + transparent + ', "' + bg_color + '", ' + spawn_rate + ', ' + lifespan + ', ' + turbo + ');');
}
canvas_element.onmousedown = function(e) {
    e.preventDefault();
    mouse.down = true;
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}
canvas_element.ontouchstart = function(e) {
    mouse.down = true;
    mouse.x = e.touches[0].pageX;
    mouse.y = e.touches[0].pageY;
}
canvas_element.onmouseup = function(e) {
    mouse.down = false;
    if (random) {
        var tmp = '#' + Math.floor(Math.random() * 16777215).toString(16);
        color = tmp;
        $("#color_picker").css("background-image", "none");
        $("#color_picker").css("background-color", tmp);
    }
}
canvas_element.ontouchend = function(e) {
    mouse.down = false;
    if (random) {
        var tmp = '#' + Math.floor(Math.random() * 16777215).toString(16);
        color = tmp;
        $("#color_picker").css("background-image", "none");
        $("#color_picker").css("background-color", tmp);
    }
}
canvas_element.onmousemove = function(e) {
    if (shape == "CODE") {
        if (e.pageX - mouse.x > 0) {
            left = true;
            right = false;
        } else if (e.pageX - mouse.x < 0) {
            left = false;
            right = true;
        } else {
            left = right = true;
        }
        if (e.pageY - mouse.y > 0) {
            up = true;
            down = false;
        } else if (e.pageY - mouse.y < 0) {
            up = false;
            down = true;
        } else {
            up = down = true;
        }
        mouse.down = true;
        clearTimeout(time_out);
        time_out = setTimeout('mouse.down=false;', 100);
    }
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}
canvas_element.ontouchmove = function(e) {
    mouse.x = e.touches[0].pageX;
    mouse.y = e.touches[0].pageY;
}
document.ontouchmove = function(e) {
    e.preventDefault();
}
$("#size_range").slider({
    range: true,
    min: 1,
    max: 50,
    values: [
        min_size, max_size
    ],
    slide: function(e, ui) {
        min_size = ui.values[0];
        max_size = ui.values[1];
    }
});
$("#rebound_slider").slider({
    min: 0,
    max: 6,
    value: rebound,
    slide: function(e, ui) {
        rebound = ui.value;
    }
});
$("#gravity_slider").slider({
    min: 0,
    max: 10,
    value: gravity,
    slide: function(e, ui) {
        gravity = ui.value;
    }
});
$("#lifespan_slider").slider({
    min: 1,
    max: 100,
    value: lifespan,
    slide: function(e, ui) {
        lifespan = ui.value;
    }
});
$("#spawn_slider").slider({
    min: 1,
    max: 20,
    value: spawn_rate,
    slide: function(e, ui) {
        spawn_rate = ui.value;
    }
});
$("#horizontal").buttonset();
$("#vertical").buttonset();
$("#horizontal_range").slider({
    range: true,
    min: 0,
    max: 30,
    values: [
        min_x, max_x
    ],
    slide: function(e, ui) {
        min_x = ui.values[0];
        max_x = ui.values[1];
    }
});
$("#vertical_range").slider({
    range: true,
    min: 0,
    max: 30,
    values: [
        min_y, max_y
    ],
    slide: function(e, ui) {
        min_y = ui.values[0];
        max_y = ui.values[1];
    }
});
$("#color_picker").simpleColorPicker({
    onChangeColor: function(c) {
        random = false;
        $("#random").prop("checked", false);
        if (c == "multi") 
            $("#color_picker").css("background-image", "url('multicolor.png')");
        else {
            $("#color_picker").css("background-image", "none");
            $("#color_picker").css("background-color", c);
        }
        color = c;
    }
});
$("#bg_color_picker").simpleColorPicker({
    colors: bg_colors,
    onChangeColor: function(c) {
        $("#bg_color_picker").css("background-color", c);
        $("body").css("background-color", c);
        bg_color = c;
    }
});
update();