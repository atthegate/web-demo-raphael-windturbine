var wtg = (function(){
		
		turbine = {
			blade1: {},
			blade2: {},
			blade3: {},
			blades: {},
			hub: {},
			cooler : {},
			tower: {},
			spinning: false
		}
		var scale_factor; 
		
		var original_height; 
		var original_width;
		
		var options={};
		tmp_to = "";

		options.blades_color='skyblue';
		options.hub_color='gray';
		options.cooler_color='gray';
		options.tower_color='gray';

		options.time=3000;
		
		var init=function(){

			var div = document.getElementById("wtg");		
			var width = div.offsetWidth;
			
			original_width = 256;
			original_height = 350;

			scale_factor = width/original_width;

			var height = original_height*scale_factor;					
			var transformation = 'S'+scale_factor+','+scale_factor+',0,0';	
			var paper = Raphael(div, width, height);

			var blade1_path = "m 126.27278,70.01328 c 0.15308,22.65236 0.11561,41.60675 -0.0907,42.37661 -0.25349,0.94581 -1.06327,1.4193 -2.49728,1.45982 -1.16724,0.0329 -2.97547,0.25029 -4.0183,0.4834 -1.21103,0.27033 -1.99141,-0.17824 -2.1599,-1.24125 -0.1451,-0.91539 0.75066,-8.08786 -3.19671,-9.76138 l -2.30636,-0.97782 5.698,-36.41092 c 5.18303,-33.12021 6.60777,-40.07727 7.88098,-37.83916 0.22659,0.39848 0.53726,19.25815 0.69038,41.91053 z";			
			var blade2_path = "m 168.55868,156.20534 c -19.69405,-11.19363 -36.09033,-20.70324 -36.65393,-21.26684 -0.6924,-0.6924 -0.69747,-1.63051 -0.0156,-2.89263 0.55501,-1.02735 1.27075,-2.70209 1.59053,-3.72165 0.37135,-1.18398 1.1499,-1.63562 2.15479,-1.25001 0.86531,0.33207 6.62899,4.69397 10.05197,2.11223 l 2,-1.50847 28.68378,23.14006 c 26.09142,21.04872 31.40409,25.76113 28.82916,25.74468 -0.45833,-0.003 -16.94665,-9.16375 -36.6407,-20.35737 z";			
			var blade3_path = "m 76.393775,156.63071 c 17.254335,-14.67787 31.798345,-26.83286 32.520705,-27.16967 0.88742,-0.41386 1.77075,-0.0978 2.72352,0.97467 0.77551,0.87294 2.10433,2.11847 2.95323,2.76749 0.98552,0.75392 1.1435,1.64008 0.43748,2.45242 -0.60798,0.69954 -6.67816,4.62372 -5.42284,8.72329 l 0.73346,2.39533 -31.554968,19.03959 c -28.70312,17.3188 -34.948371,20.69934 -34.052267,18.28534 0.159589,-0.42969 14.407235,-12.79046 31.661544,-27.46838 z";			
			
			var hub_path = "m 126.28647,117.85884 c 3.80588,2.50542 4.86011,7.62174 2.35469,11.42762 -2.50542,3.80589 -7.62174,4.86012 -11.42763,2.3547 -3.80588,-2.50542 -4.86011,-7.62175 -2.35469,-11.42763 2.48606,-3.77647 7.54852,-4.8485 11.35196,-2.40391";			
			var cooler_path = "m 115.17001,112.39628 c 2.25953,-0.54854 4.57725,-0.98069 7.07107,-1.06065 2.33287,0.16084 4.61836,0.46381 6.71751,1.32582 l 1e-5,-8.66206 -13.78859,10e-6 z"
			var tower_path = "M 118.9375,137.04289 110,291.5 l 21.5,0.5 -7,-155 z"			
			
			var hub_center = {
				x: 122,
				y: 125
			}

			var blade1_path_scaled = Raphael.transformPath(blade1_path, transformation);
			var blade2_path_scaled = Raphael.transformPath(blade2_path, transformation);
			var blade3_path_scaled = Raphael.transformPath(blade3_path, transformation);
			var hub_path_scaled = Raphael.transformPath(hub_path, transformation);
			var cooler_path_scaled = Raphael.transformPath(cooler_path, transformation);
			var tower_path_scaled = Raphael.transformPath(tower_path, transformation);	

			turbine.hub_center_scaled = {
				x: hub_center.x * scale_factor,
				y: hub_center.y * scale_factor
			}

			turbine.blade1 = paper.path(blade1_path_scaled);
			turbine.blade2 = paper.path(blade2_path_scaled);
			turbine.blade3 = paper.path(blade3_path_scaled);

			turbine.blades_set = paper.set();
			turbine.blades_set.push(
				turbine.blade1,
				turbine.blade2,
				turbine.blade3
			)
			
			Raphael.st.compoundPath = function(){
				var positions = [];
				this.forEach( function( element ){
					positions.push( element.compoundPath() );
				});
				return positions.join('');
			} 
			
			Raphael.el.compoundPath = function(){
				var path = this.attr('path');
				return path ? Raphael.parsePathString( path ).join('') : '';
			}
			
			turbine.blades = paper.path( turbine.blades_set.compoundPath() );
			turbine.blades_set.remove(); 
			
			turbine.blades.attr({fill: options.blades_color, "stroke-width": 0});

			turbine.hub = paper.path(hub_path_scaled);
			turbine.hub.attr({fill: options.hub_color, "stroke-width": 0});
			
			turbine.cooler = paper.path(cooler_path_scaled);
			turbine.cooler.attr({fill: options.cooler_color, "stroke-width": 0});

			turbine.tower = paper.path(tower_path_scaled);
			turbine.tower.attr({fill: options.tower_color, "stroke-width": 0});
		
			turbine.blades.toFront();

		}
		
		var start=function(turbine){
			if (turbine.spinning){return}else{turbine.spinning=true}

			var current_blades_path = Raphael.transformPath(turbine.blades.attr('path'), turbine.blades.attr('transform'))
			//var current_blade2_path = Raphael.transformPath(turbine.blade2.attr('path'), turbine.blade2.attr('transform'))
			//var current_blade3_path = Raphael.transformPath(turbine.blade3.attr('path'), turbine.blade3.attr('transform'))
		
			turbine.blades.attr({path: current_blades_path, transform: ''});	
			//turbine.blade2.attr({path: current_blade2_path, transform: ''});
			//turbine.blade3.attr({path: current_blade3_path, transform: ''});

			var position = 'r' + 360 + ', ' + turbine.hub_center_scaled.x + ', ' + turbine.hub_center_scaled.y;				
			console.log("Start! " + position +" | |"+ turbine.blades.attr('transform'));
			var anim = Raphael.animation({transform: position}, options.time, 'linear').repeat(Infinity); 
			turbine.blades.animate(anim);
			position = '';

		}
		
		var stop=function(turbine){
			if (!turbine.spinning){return}else{turbine.spinning=false}
			//turbine.blades.stop();
			
			var current_blades_path = Raphael.transformPath(turbine.blades.attr('path'), turbine.blades.attr('transform'));
			//var current_blade2_path = Raphael.transformPath(turbine.blade2.attr('path'), turbine.blade2.attr('transform'))
			//var current_blade3_path = Raphael.transformPath(turbine.blade3.attr('path'), turbine.blade3.attr('transform'))
		
			turbine.blades.attr({path: current_blades_path, transform: ''});	
			//turbine.blade2.attr({path: current_blade2_path, transform: ''});
			//turbine.blade3.attr({path: current_blade3_path, transform: ''});
			
			var position='R' + 90 + ', ' + turbine.hub_center_scaled.x + ', ' + turbine.hub_center_scaled.y;
			tmp_to = position;
			console.log("Stop! " + position +" | |"+ turbine.blade1.attr('transform'));
			var anim = Raphael.animation({transform: position}, 3000, '>', turbine.blades.stop()); 
			turbine.blades.animate(anim);
			position = '';

			
			var current_blades_path = Raphael.transformPath(turbine.blades.attr('path'), turbine.blades.attr('transform'))
			//var current_blade2_path = Raphael.transformPath(turbine.blade2.attr('path'), turbine.blade2.attr('transform'))
			//var current_blade3_path = Raphael.transformPath(turbine.blade3.attr('path'), turbine.blade3.attr('transform'))
		
			turbine.blades.attr({path: current_blades_path, transform: ''});	
			//turbine.blade2.attr({path: current_blade2_path, transform: ''});
			//turbine.blade3.attr({path: current_blade3_path, transform: ''});
			

		}

		return {
			start: start,
			stop: stop,
			init: init,
			options: options
		}
}());
