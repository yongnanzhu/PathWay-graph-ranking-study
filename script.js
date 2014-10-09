//(function(window, document) {


var loading = document.getElementById('loading'),
	content = document.getElementById('content'),
	counter = 0,
	$hashes = {},
	$slides = [],
	$scroll = 0,
	$target = 0,
	$height = 0,
	$hash;

//debug mode
var play = function() {
	content.style.display = 'block';
	loading.style.display = 'none';
	if(window.location.hash) {
		$hash = window.location.hash.substring(7);
		$target = $hashes[$hash] * $height;
		window.scrollTo(0, $target);
		for(var j = 0, k = $hashes[$hash]; j < k; j++) {
			if($slides[j].build) {
				while($slides[j].build.length) {
					$slides[j].build.pop().style.opacity = 1;
				}
			}
		}
	} else {
		window.location.hash = 'slide-' + $slides[0].hash;
	}
};

var prepare = function() {
	$height = window.innerHeight;
	[].forEach.call(content.getElementsByTagName('article'), function(element, idx) {
		var _pager = document.createElement('span');
		_pager.className = 'pager';
        if(idx === 0)
        {
            _pager.innerHTML = "Begin";
        }
        else
        {
            _pager.innerHTML = "Graph" + idx;
        }

		_pager.style.top = idx * $height + 10 + 'px';
		element.appendChild(_pager);
		element.style.height = $height + 'px';
		$hashes[element.id] = idx;
		$slides[idx] = {
			hash   : element.id,
			slide  : element,
			pager  : _pager
		};
		var buildNodes = element.querySelectorAll('.build > *');
		if(buildNodes.length) {
			$slides[idx].build = [].map.call(buildNodes, function(node) {
				node.style.opacity = 0;
				node.style.webkitTransition = 'opacity 1s ease-in-out';
				return node;
			});
		}
		var bg = new Image();
		bg.src = element.dataset.bg;
		bg.addEventListener('load', function() {
			element.style.backgroundImage = 'url(' + element.dataset.bg + ')';
			if(element.dataset.type == 'parallax') {
				$slides[idx].height = parseInt(bg.height);
			}
			counter++;
			if(counter == $slides.length) {
				play();
			}
		}, false);
	});
};
window.addEventListener('load', prepare, false);

var reinit = function() {
	$height = window.innerHeight;
	$slides.forEach(function(elem, indx) {
		elem.slide.style.height = $height + 'px';
		elem.pager.style.top = indx * $height + 10 + 'px';

	});
	hashback();
};
window.addEventListener('resize', reinit, false);

var scroller = function() {
	$scroll = document.body.scrollTop;
	$slides.forEach(function(el, i) {
		switch(true) {
			case ($scroll > (i - 1) * $height && $scroll <= i * $height):
				$slides[i].pager.style.top = i * $height - $scroll + 10 + 'px';
				if($slides[i].slide.dataset.type == 'parallax') {
					$slides[i].slide.style.backgroundPositionY = (1 - $slides[i].height / $height) * ($scroll + $height - i * $height) + 'px';
				}
				break;
			case ($scroll > i * $height && $scroll <= (i + 1) * $height - 60):
				$slides[i].pager.style.top = '10px';
				break;
			default:
				$slides[i].pager.style.top = (i + 1) * $height - $scroll - 50 + 'px';
		};
	});
};
document.addEventListener('scroll', scroller, false);

var scrolling = function() {
	var step = Math.min(Math.ceil(Math.abs($target - $scroll) / 5), 150);
	window.scrollTo(0, ($target > $scroll) ? ($scroll + step) : ($scroll - step));
	if($scroll != $target) {
		window.setTimeout(scrolling, 16);
	}
};
var hashback = function(e) {
	e && e.preventDefault();
	$hash = window.location.hash.substring(7);
	$target = $hashes[$hash] * $height;
	scrolling();
};
window.addEventListener('hashchange', hashback, false);

var control = function(e) {
	switch(e.keyCode) {
		case 33:
		case 37:
		case 38:
			e.preventDefault();
			if($hashes[$hash]) {
				window.location.hash = 'slide-' + $slides[$hashes[$hash] - 1].hash;
			}
			break;
		case 36:
			e.preventDefault();
			window.location.hash = 'slide-' + $slides[0].hash;
			break;
		case 32:
		case 34:
		case 39:
		case 40:
			e.preventDefault();
			if($slides[$hashes[$hash]].build && $slides[$hashes[$hash]].build.length) {
				$slides[$hashes[$hash]].build.shift().style.opacity = 1;
			} else if($hashes[$hash] < $slides.length - 1) {
				window.location.hash = 'slide-' + $slides[$hashes[$hash] + 1].hash;
			}
			break;
		case 35:
			e.preventDefault();
			window.location.hash = 'slide-' + $slides[$slides.length - 1].hash;
			break;
		default:;
	};
};
window.addEventListener('keydown', control, false);


//})(window, document);