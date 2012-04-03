/**
 * @author sole / http://soledadpenades.com
 * @author mr.doob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 */

var TWEEN = TWEEN || ( function () {

	var _interval = null, _fps = 60, _autostart = false, _tweens = [];

	return {
	
		setFPS: function ( fps ) {

			_fps = fps || 60;

		},

		start: function ( fps ) {

			if ( fps ) {

				this.setFPS( fps );

			}

			if ( _interval === null ) {

				_interval = setInterval( this.update, 1000 / _fps );

			}

		},

		stop: function () {

			clearInterval( _interval );

			_interval = null;

		},

		setAutostart: function ( value ) {

			_autostart = value;

			if ( _autostart && _tweens.length ) {

				this.start();

			}

		},

		add: function ( tween ) {

			_tweens.push( tween );

			if ( _autostart ) {

				this.start();

			}

		},

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			var i = 0, num_tweens = _tweens.length, time = time || Date.now();

			while ( i < num_tweens ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );
					num_tweens--;

				}

			}

			if ( num_tweens === 0 && _autostart ) {

				TWEEN.stop();

			}

		},

		// Containers for easing functions
		Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {}

	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object,
	_valuesStart = {},
	_valuesDelta = {},
	_valuesEnd = {},
	_duration = 1000,
	_delayTime = 0,
	_startTime = null,
	_easingFunction = TWEEN.Linear.None,
	_chainedTween = null,
	_onUpdateCallback = null,
	_onCompleteCallback = null;

	this.to = function ( properties, duration ) {

		if( duration !== null ) {

			_duration = duration;

		}

		for ( var property in properties ) {

			// This prevents the engine from interpolating null values
			if ( _object[ property ] === null ) {

				continue;

			}

			// The current values are read when the tween starts;
			// here we only store the final desired values
			_valuesEnd[ property ] = properties[ property ];

		}

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_startTime = time ? time + _delayTime : Date.now() + _delayTime;

		for ( var property in _valuesEnd ) {

			// Again, prevent dealing with null values
			if ( _object[ property ] === null ) {

				continue;

			}

			_valuesStart[ property ] = _object[ property ];
			_valuesDelta[ property ] = _valuesEnd[ property ] - _object[ property ];

		}

		return this;
	};

	this.stop = function () {

		TWEEN.remove( this );
		return this;

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.chain = function ( chainedTween ) {

		_chainedTween = chainedTween;
		return this;

	};

	this.onUpdate = function ( onUpdateCallback ) {

		_onUpdateCallback = onUpdateCallback;
		return this;

	};

	this.onComplete = function ( onCompleteCallback ) {

		_onCompleteCallback = onCompleteCallback;
		return this;

	};

	this.update = function ( time ) {

		var property, elapsed, value;

		if ( time < _startTime ) {

			return true;

		}

		elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction( elapsed );

		for ( property in _valuesDelta ) {

			_object[ property ] = _valuesStart[ property ] + _valuesDelta[ property ] * value;

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _onCompleteCallback !== null ) {

				_onCompleteCallback.call( _object );

			}

			if ( _chainedTween !== null ) {

				_chainedTween.start();

			}

			return false;

		}

		return true;

	};

	/*
	this.destroy = function () {

		TWEEN.remove( this );

	};
	*/
}


TWEEN.Linear.None = function ( k ) {

	return k;

};

//

TWEEN.Quadratic.In = function ( k ) {

	return k * k;

};

TWEEN.Quadratic.Out = function ( k ) {

	return k * ( 2 - k );

};

TWEEN.Quadratic.InOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
	return - 0.5 * ( --k * ( k - 2 ) - 1 );

};

//

TWEEN.Cubic.In = function ( k ) {

	return k * k * k;

};

TWEEN.Cubic.Out = function ( k ) {

	return --k * k * k + 1;

};

TWEEN.Cubic.InOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k + 2 );

};

//

TWEEN.Quartic.In = function ( k ) {

	return k * k * k * k;

};

TWEEN.Quartic.Out = function ( k ) {

	return 1 - --k * k * k * k;

}

TWEEN.Quartic.InOut = function ( k ) {

	if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
	return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

};

//

TWEEN.Quintic.In = function ( k ) {

	return k * k * k * k * k;

};

TWEEN.Quintic.Out = function ( k ) {

	return --k * k * k * k * k + 1;

};

TWEEN.Quintic.InOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

};

// 

TWEEN.Sinusoidal.In = function ( k ) {

	return 1 - Math.cos( k * Math.PI / 2 );

};

TWEEN.Sinusoidal.Out = function ( k ) {

	return Math.sin( k * Math.PI / 2 );

};

TWEEN.Sinusoidal.InOut = function ( k ) {

	return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

};

//

TWEEN.Exponential.In = function ( k ) {

	return k === 0 ? 0 : Math.pow( 1024, k - 1 );

};

TWEEN.Exponential.Out = function ( k ) {

	return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

};

TWEEN.Exponential.InOut = function ( k ) {

	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
	return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

};

//

TWEEN.Circular.In = function ( k ) {

	return 1 - Math.sqrt( 1 - k * k );

};

TWEEN.Circular.Out = function ( k ) {

	return Math.sqrt( 1 - --k * k );

};

TWEEN.Circular.InOut = function ( k ) {

	if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

};

//

TWEEN.Elastic.In = function ( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
	return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

};

TWEEN.Elastic.Out = function ( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
	return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

};

TWEEN.Elastic.InOut = function ( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
	if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
	return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

};

//

TWEEN.Back.In = function ( k ) {

	var s = 1.70158;
	return k * k * ( ( s + 1 ) * k - s );

};

TWEEN.Back.Out = function ( k ) {

	var s = 1.70158;
	return --k * k * ( ( s + 1 ) * k + s ) + 1;

};

TWEEN.Back.InOut = function ( k ) {

	var s = 1.70158 * 1.525;
	if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
	return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

};

//

TWEEN.Bounce.In = function ( k ) {

	return 1 - TWEEN.Bounce.Out( 1 - k );

};

TWEEN.Bounce.Out = function ( k ) {

	if ( k < ( 1 / 2.75 ) ) {

		return 7.5625 * k * k;

	} else if ( k < ( 2 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

	} else if ( k < ( 2.5 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

	} else {

		return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

	}

};

TWEEN.Bounce.InOut = function ( k ) {

	if ( k < 0.5 ) return TWEEN.Bounce.In( k * 2 ) * 0.5;
	return TWEEN.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

};
