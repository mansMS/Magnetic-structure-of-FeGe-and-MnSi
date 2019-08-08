



// ввод периода решетки в СИ
var a = 4.558 * Math.pow(10, -10);

// ввод параметров материала (коэффициенты в выражении для своболной энергии)
// ввод коэффициента b в СИ
var b = 1.14 * Math.pow(10, -14);

//ввод коэфиициента B1 в СИ
var B1 = 2.54 * Math.pow(10, -23);

//ввод коэфиициента B2 в СИ
var B2 = -6.35 * Math.pow(10, -25);

//ввод коэффициента T0
var T0 = 26;

//ввод коэффициента T
var T = 10;

//ввод коэффициента alfa
var alfa = 6.44 * Math.pow(10, -7);

//расчет коэффициента A
var A = 2 * alfa * (T - T0);

//расчет величины вектора k
var k = Math.abs(b) / (B1 + B2/3);

//расчет шага винтовой линии
var h = 2 * Math.PI / k;

//расчет отношения шага винтовой линии к периоду решетки
console.log(h/a);

if (B2 < 0) {
	//расчет направления вектора k и его проекций
	var kx = 
		ky = 
		kz = k / Math.sqrt(3);

	//расчет направления вкторов m1 и m2 и их проекций
	//вычисление единичного вектора оси поворота
	var v = [-1*ky/k + 0*kz/k, 1*kx/k - 0*kz/k, -0*kx/k + 0*ky/k];

	var normV = Math.sqrt(Math.pow(Math.abs(v[0]),2) + Math.pow(Math.abs(v[1]),2) + Math.pow(Math.abs(v[2]),2));

	var vx = v[0] / normV;
	var vy = v[1] / normV;
	var vz = v[2] / normV;

	//вычисление угла поворота
	var tet = Math.acos(1 * kz / k);

	//вычисление матрицы поворота
	var M = [[Math.cos(tet) + (1 - Math.cos(tet)) * Math.pow(vx,2)]];
	M[0][1] = (1 - Math.cos(tet)) * vx * vy - Math.sin(tet) * vz;
	M[0][2] = (1 - Math.cos(tet)) * vy * vz + Math.sin(tet) * vy;

	M[1] = [(1 - Math.cos(tet)) * vx * vy + Math.sin(tet) * vz];
	M[1][1] = Math.cos(tet) + (1 - Math.cos(tet)) * Math.pow(vy,2);
	M[1][2] = (1 - Math.cos(tet)) * vy * vz - Math.sin(tet) * vx;

	M[2] = [(1 - Math.cos(tet)) * vx * vz - Math.sin(tet) * vy];
	M[2][1] = (1 - Math.cos(tet)) * vy * vz + Math.sin(tet) * vx;
	M[2][2] = Math.cos(tet) + (1 - Math.cos(tet)) * Math.pow(vz,2);

	console.log(M[0][2], M[1][2], M[2][2]);

	//вычисление обратной матрицы поворота
	var M1 = InverseMatrix(M);

	//расчет проекций вектора m2
	var m2 = [M[0][0], M[1][0], M[2][0]];
	var m2x = m2[0];
	var m2y = m2[1];
	var m2z = m2[2];

	//расчет проекций вектора m1
	var m1 = [M[0][1], M[1][1], M[2][1]];
	var m1x = m1[0];
	var m1y = m1[1];
	var m1z = m1[2];

	//проверка направления вектора [m2, m1] и вектора k по коэффициенту b
	if (b < 0) {
		var px = m2x, py = m2y, pz = m2z;
		m2x = m1x, m2y = m1y, m2z = m1z, 
		m1x = px, m1y = py, m1z = pz;
	};

	//проекции нормированного вектора намагниченного момента S в репере x, y, z
	function Sx(x, y, z) {
		return m1x * Math.cos(kx*x + ky*y + kz*z) - m2x * Math.sin(kx*x + ky*y + kz*z);
	};

	function Sy(x, y, z) {
		return m1y * Math.cos(kx*x + ky*y + kz*z) - m2y * Math.sin(kx*x + ky*y + kz*z);
	};

	function Sz(x, y, z) {
		return m1z * Math.cos(kx*x + ky*y + kz*z) - m2z * Math.sin(kx*x + ky*y + kz*z);
	};

	//проекции нормированного векторного магнитного момента S в репере m2, m1, k
	function Sm2(r) {
		return -Math.sin(k * r);
	};

	function Sm1(r) {
		return -Math.cos(k * r);
	};

	function Sk(r) {
		return 0;
	};

	//распределение вектора магниного момента S в координатах x, y, z (масштаб по осям в нанометрах)
	//***********************************
	//***********************************
	//***********************************
	//***********************************
	//***********************************
	// Table[VectorPlot3D[{Sx[x,y,z], Sy[x,y,z], Sz[x,y,z]}, {x, 0, 2h/(10^(-9))}, {y, 0, 2h/(10^(-9))}, {z, 0, 2h/(10^(-9))}]];

	var x , y, z, mas = [], masLength = 0, bound = 2*h*1000000000, interval = bound / 8;

	for(let x = 0; x <=bound; x+=interval) {
		for(let y = 0; y <=bound; y+=interval) {
			for(let z = 0; z <=bound; z+=interval) {

				mas.push([x,y,z,Sx(x,y,z),Sy(x,y,z),Sz(x,y,z)]);
				masLength++;

				// x = xi;
				// y = yi;
				// z = zi;

				// console.log(mas);
			}
		}
	}
	console.log(2*h*1000000000);


	console.log('координаты - ', mas[94]);

	//геликоидальная структура векторного магнитного момента S в координатах x, y, z (масштаб по осям в нанометрах)
	//***********************************
	//***********************************
	//***********************************
	//***********************************
	//***********************************
} else {
	//расчет величины вектора k
	var kx = 
		ky = 0,
		kz = k;

	//расчет проекций вектора m1 и m2
	//проверка направлений вектора [m2, m1] и вектора k по коэфиициенту b
	if (b > 0) {
		var m2x = 1,
			m2y = 0,
			m2z = 0,
			m1x = 0,
			m1y = 1,
			m1z = 0;
	} else {
		var m1x = 1,
			m1y = 0,
			m1z = 0,
			m2x = 0,
			m2y = 1,
			m2z = 0;
	};

	//проекции нормированного вектора магнитного момента S в репере x, y, z
	function SSx(x, y, z) {
		return m1x * Math.cos(kx*x + ky*y + kz*z) - m2x * Math.sin(kx*x + ky*y + kz*z);
	}

	function SSy(x, y, z) {
		return m1y * Math.cos(kx*x + ky*y + kz*z) - m2y * Math.sin(kx*x + ky*y + kz*z);
	}

	function SSz(x, y, z) {
		return m1z * Math.cos(kx*x + ky*y + kz*z) - m2z * Math.sin(kx*x + ky*y + kz*z);
	}

	//распределение вектора магнитного момента S в координатах x, y, z (масштаб по осям в нанометрах)
	//***************************
	//***************************
	//***************************
	//***************************

	//геликоидальная структура векторного магнитного момента S в координатах x, y, z (масштаб по осям в нанометрах)
	//***********************************
	//***********************************
	//***********************************
	//***********************************
	//***********************************

}
console.log(kz);

console.log(x,y,z);











//функция для нахождения определителя матрицы
function Determinant(A)   // Используется алгоритм Барейса, сложность O(n^3)
{
    var N = A.length, B = [], denom = 1, exchanges = 0;
    for (var i = 0; i < N; ++i)
     { B[ i ] = [];
       for (var j = 0; j < N; ++j) B[ i ][j] = A[ i ][j];
     }
    for (var i = 0; i < N-1; ++i)
     { var maxN = i, maxValue = Math.abs(B[ i ][ i ]);
       for (var j = i+1; j < N; ++j)
        { var value = Math.abs(B[j][ i ]);
          if (value > maxValue){ maxN = j; maxValue = value; }
        }
       if (maxN > i)
        { var temp = B[ i ]; B[ i ] = B[maxN]; B[maxN] = temp;
          ++exchanges;
        }
       else { if (maxValue == 0) return maxValue; }
       var value1 = B[ i ][ i ];
       for (var j = i+1; j < N; ++j)
        { var value2 = B[j][ i ];
          B[j][ i ] = 0;
          for (var k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[ i ][k]*value2)/denom;
        }
       denom = value1;
     }
    if (exchanges%2) return -B[N-1][N-1];
    else return B[N-1][N-1];
};

//функция для нахождения союзной матрицы
function AdjugateMatrix(A)   // A - двумерный квадратный массив
{                                        
    var N = A.length, adjA = [];
    for (var i = 0; i < N; i++)
     { adjA[ i ] = [];
       for (var j = 0; j < N; j++)
        { var B = [], sign = ((i+j)%2==0) ? 1 : -1;
          for (var m = 0; m < j; m++)
           { B[m] = [];
             for (var n = 0; n < i; n++)   B[m][n] = A[m][n];
             for (var n = i+1; n < N; n++) B[m][n-1] = A[m][n];
           }
          for (var m = j+1; m < N; m++)
           { B[m-1] = [];
             for (var n = 0; n < i; n++)   B[m-1][n] = A[m][n];
             for (var n = i+1; n < N; n++) B[m-1][n-1] = A[m][n];
           }
          adjA[ i ][j] = sign*Determinant(B);   // Функцию Determinant см. выше
        }
     }
    return adjA;
};

//функция для нахождения обратной матрицы
function InverseMatrix(A)   // A - двумерный квадратный массив
{   
    var det = Determinant(A);                // Функцию Determinant см. выше
    if (det == 0) return false;
    var N = A.length, A = AdjugateMatrix(A); // Функцию AdjugateMatrix см. выше
    for (var i = 0; i < N; i++)
     { for (var j = 0; j < N; j++) A[ i ][j] /= det; }
    return A;
};


window.onload = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	var canvas = document.getElementById('canvas');

	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);

	// init renderer
	var renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(width, height);
	renderer.setClearColor(0x000000);

	// init scene and camera
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	// camera.position.set(2.35, 1.75, 5);
	camera.position.set(23.5, 17.5, 50);
	controls = new THREE.OrbitControls(camera);

	//масштабирование при изменении экрана
	window.addEventListener('resize', function() {
			var width = window.innerWidth;
			var height = window.innerHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		});


	//материал
	// var light = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
 //    light.position.set(1, 0.25, 0.6);
 //    scene.add(light);

	// var sideGeometry = new THREE.BoxGeometry(1, 2, 2.75);
	// var centerGeometry = new THREE.BoxGeometry(2, 2, 2.75);

	// var sideMaterial = new THREE.MeshPhongMaterial({color: 0xd3d3d3, specular: 0x666666, shininess: 10, opacity: 0.7, transparent: true});
	// var centerMaterial = new THREE.MeshPhongMaterial({color: 0x88c88c, specular: 0x666666, shininess: 10, opacity: 0.7, transparent: true});

	// var leftSide = new THREE.Mesh(sideGeometry, sideMaterial);
	// var rightSide = new THREE.Mesh(sideGeometry, sideMaterial);
	// var center = new THREE.Mesh(centerGeometry, centerMaterial);

	// scene.add(leftSide);
	// scene.add(rightSide);
	// scene.add(center);

	// leftSide.position.set(-1.5, 0, 0);
	// rightSide.position.set(1.5, 0, 0);





	var x0 = 0;
	var y0 = 0;
	var z0 = 0;
	var r = 1;
	var l = 1.2;

	var dir = new THREE.Vector3(0, 1, 0);//направление
	dir.normalize();//нормализация вектора
	var origin = new THREE.Vector3(x0, y0, z0);//начало стрелки
	var length = 3;
	var hex = 0xffffff;
	var headLength = length * 0.1;//длина головы стрелки. По умолчанию длина 0,2
	var headWidth = headLength * 0.3;//ширины стрелки. По умолчанию 0,2 * headLength
	var waveVector = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth);

	var magneticStructure = new THREE.Group();
	magneticStructure.add( waveVector );

	for (var i = 0; i < masLength; i++) {
		// let x = x0 + r * Math.cos(i * Math.PI / 10);
		// let y = y0 + r * Math.sin(i * Math.PI / 10);
		var dir = new THREE.Vector3( mas[i][3], mas[i][4], mas[i][5] );//направление
		dir.normalize();//нормализация вектора
		var origin = new THREE.Vector3(mas[i][0]-mas[i][3]*0.15, mas[i][1]-mas[i][4]*0.15, mas[i][2]-mas[i][5]*0.15);//начало стрелки
		console.log(Math.sign(mas[i][3]));
		var length = l;
		var hex = 0xffffff;
		var headLength = length * 0.4;//длина головы стрелки. По умолчанию длина 0,2
		var headWidth = headLength * 0.3;//ширины стрелки. По умолчанию 0,2 * headLength
		var magnetizationVector = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth);
		// scene.add( arrowHelper );
		magneticStructure.add( magnetizationVector );

		// var origin = new THREE.Vector3(mas[i][0], mas[i][1], mas[i][2]);//начало стрелки
		// var hex = 0xff00ff;
		// var magnetizationVector = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth);
		// magneticStructure.add( magnetizationVector );

	}

	var dirX = new THREE.Vector3( 1, 0, 0 );//направление
	var dirY = new THREE.Vector3( 0, 1, 0 );//направление
	var dirZ = new THREE.Vector3( 0, 0, 1 );//направление
	var osi = new THREE.Vector3(0, 0, 0);//начало стрелки
	var osiLength = 40;//длина стрелки
	var osXhex = 0x00ff00;
	var osYhex = 0x0000ff;
	var osZhex = 0xff0000;
	var osXVector = new THREE.ArrowHelper(dirX, osi, osiLength, osXhex, headLength*3, headWidth*3);
	var osYVector = new THREE.ArrowHelper(dirY, osi, osiLength, osYhex, headLength*3, headWidth*3);
	var osZVector = new THREE.ArrowHelper(dirZ, osi, osiLength, osZhex, headLength*3, headWidth*3);
	magneticStructure.add( osXVector );
	magneticStructure.add( osYVector );
	magneticStructure.add( osZVector );

	scene.add( magneticStructure );
	// magneticStructure.rotation.setFromVector3(new THREE.Vector3( -Math.PI / 4, 0, -Math.PI / 4));
	 magneticStructure.position.set(-14, -14, -14);


// {
// 	for (var i = 0; i < 60; i++) {
// 		let x = x0 + r * Math.cos(i * Math.PI / 10);
// 		let y = y0 + r * Math.sin(i * Math.PI / 10);
// 		var dir = new THREE.Vector3( x, 0, y );//направление
// 		dir.normalize();//нормализация вектора
// 		var origin = new THREE.Vector3(0, i/25, 0);//начало стрелки
// 		var length = l;
// 		var hex = 0xffff00;
// 		var headLength = length * 0.15;//длина головы стрелки. По умолчанию длина 0,2
// 		var headWidth = headLength * 0.5;//ширины стрелки. По умолчанию 0,2 * headLength
// 		var magnetizationVector = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth);
// 		// scene.add( arrowHelper );
// 		magneticStructure.add( magnetizationVector );

// 	}
// 	scene.add( magneticStructure );
// 	magneticStructure.rotation.setFromVector3(new THREE.Vector3( -Math.PI / 4, 0, -Math.PI / 4));
// 	magneticStructure.position.set(-0.5, -0.5, 2.75/2-0.5);
// }



	//красная луна
	// var box = new THREE.BoxGeometry(1, 1, 1);
 //    var sphere = new THREE.SphereGeometry(.65, 32, 32);

 //    var singleGeometry = new THREE.Geometry();

 //    var boxMesh = new THREE.Mesh(box);
 //    var sphereMesh = new THREE.Mesh(sphere);

 //    boxMesh.updateMatrix(); // as needed
 //    singleGeometry.merge(boxMesh.geometry, boxMesh.matrix);

 //    sphereMesh.updateMatrix(); // as needed
 //    singleGeometry.merge(sphereMesh.geometry, sphereMesh.matrix);

 //    var material = new THREE.MeshPhongMaterial({color: 0xFF0000, specular: 0x666666});
 //    var mesh = new THREE.Mesh(singleGeometry, material);
 //    scene.add(mesh);
 //    mesh.position.set(-4, 4, 0);




	function loop() {
		renderer.render(scene, camera);
		requestAnimationFrame(function() {loop()})
	};

	loop();
}