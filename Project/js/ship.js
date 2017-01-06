
   // <iframe name="toppage" width=100% height=100% marginwidth=50 marginheight=50 frameborder="no" border="0"  src="shiyan2.html" ></iframe>
    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        document.getElementById( 'container' ).innerHTML = "";
    }
    //<audio src="/Mp3/BGM.mp3" controls="autoplay"></audio>
    var container, stats;
    var camera, scene, renderer;
    var Dirlight,Amlight,Splight;//����ƽ�й⣬�����⣬���
    var parameters = {
        width: 2000,//x���򳤶�
        height: 2000,//y���򳤶�
        widthSegments: 250,//x����ֶ���
        heightSegments: 250,//z����ֶ���
        depth: 1500,//����ˮ���������Ķ�λ�ã�����Խ�󣬺�ƽ��ԽԶ������ȣ�
        param: 4,
        filterparam: 1
    };
    var waterNormals,info;
    init();
    animate();
    function init() {
        container = document.createElement( 'div' );
        document.body.appendChild( container );
        renderer = new THREE.WebGLRenderer();//������Ⱦ��
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        scene = new THREE.Scene();//���峡��
        camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 3000000 );
        camera.position.set( 266.42619955078914, 271.66231875732154, 3440.9940177949984 );//�������
        controls = new THREE.OrbitControls( camera, renderer.domElement );//����еĹ���ؼ�
        controls.enablePan = false;
        controls.minDistance = 1.0;
        controls.maxDistance = 50000.0;
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set( 0, 500, 0 );
        Amlight = new THREE.AmbientLight( 0x444444 );
        scene.add(Amlight);//���ӻ�����444444
        Dirlight = new THREE.DirectionalLight( 0xffffbb, 1 );//���ӷ���⣬ģ������ffffbb
         Dirlight.position.set( - 1, 1, - 1 );
         scene.add( Dirlight );
        waterNormals = new THREE.TextureLoader().load( 'waternormals.jpg' );//��ˮ�����Ӳ���
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        water = new THREE.Water( renderer, camera, scene, {
            textureWidth: 512,//Ϊ�˴ﵽ��õ�Ч�������ʹ�������ε�ͼƬ���䳤������2�Ĵη���
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 	1.0,
            sunDirection: Dirlight.position.clone().normalize(),
            sunColor:0xffffff,//�������������ɫΪ��ɫ��ˮ�浹Ӱ��������ɫffffff
            waterColor: 0x001e0f,//����ˮ�����ɫ001e0f

            distortionScale: 50.0,
        } );
        mirrorMesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry( parameters.width * 500, parameters.height * 500 ),
                water.material
        );
        mirrorMesh.add( water );
        mirrorMesh.rotation.x = - Math.PI * 0.5;
        scene.add( mirrorMesh );
        // load skybox
        var cubeMap = new THREE.CubeTexture( [] );//����һ��CubeMap����һ��CubeMap��һ������6�������ļ���
                                                       //
        cubeMap.format = THREE.RGBFormat;
        var loader = new THREE.ImageLoader();
        loader.load( 'skyboxsun25degtest.png', function ( image ) {
            var getSide = function ( x, y ) {
                var size = 1024;
                var canvas = document.createElement( 'canvas' );
                canvas.width = size;
                canvas.height = size;
                var context = canvas.getContext( '2d' );
                context.drawImage( image, - x * size, - y * size );
                return canvas;
            };
            cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
            cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
            cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
            cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
            cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
            cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
            cubeMap.needsUpdate = true;
        } );
        var cubeShader = THREE.ShaderLib[ 'cube' ];//������ɫ�������THREE.ShaderMaterial
        cubeShader.uniforms[ 'tCube' ].value = cubeMap;
        var skyBoxMaterial = new THREE.ShaderMaterial( {//���������Ը���
            fragmentShader: cubeShader.fragmentShader,//ƬԪ��ɫ��
            vertexShader: cubeShader.vertexShader,//������ɫ��
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide/////////////////��ԭ������Material�ķ���������ǰ����ShaderMaterial��ʹ��.
        } );
        var skyBox = new THREE.Mesh(
                new THREE.BoxGeometry( 1000000, 1000000, 1000000 ),
                skyBoxMaterial//���������ShaderMaterial�Լ�CubeMap�������񣬼ӵ�������
        );
        scene.add( skyBox );
        document.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case 76://�û�L
                    // alert('�㰴������');
                        scene.remove(skyBox);//�Ƴ���պУ�����ҹ���龰
                        Amlight.visible=false;//�����⣬ƽ�йⲻ�ɼ�
                        Dirlight.visible=false;
                        alert('����ˣ���С�ļ�ʻ');
                        Splight=new THREE.SpotLight(0x444444 );
                        Splight.position.set(-200,500,200);
                        Splight.castShadow=true;
                        Splight.target=mirrorMesh;
                        scene.add(Splight);
                    break;
                case 75://�û�K
                    // alert('�㰴������');
                    scene.add(skyBox);
                    Amlight.visible=true;
                    Dirlight.visible=true;
                    scene.remove(Splight);
                    break;
            }
        }, false);
        var material = new THREE.MeshPhongMaterial( {
            vertexColors: THREE.FaceColors,
            shininess: 100,//�߹��ǿ��,, ��ֵԽ��,�߹���ֳ�һ������.
            envMap: cubeMap//������ͼ
        } );
    }
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) { };
    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'obj/ship/' );
    mtlLoader.load( 'fanchuan.mtl', function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'obj/ship/' );
        objLoader.load( 'fanchuan.obj', function ( objectfunchuan ) {
            objectfunchuan.position.y -= 45;
            objectfunchuan.position.x=+250;
            var time = performance.now() * 0.01;
            objectfunchuan.scale.x=objectfunchuan.scale.y=objectfunchuan.scale.z=0.025;
            document.addEventListener('keydown', function (event) {
                switch (event.keyCode) {
                    case 65:
                        objectfunchuan.position.x+=10;
                        camera.position.x+=10;
                        event.preventDefault();
                        break;
                    case 87:
                        objectfunchuan.position.z+=15;
                        camera.position.z+=15;
                        var time = performance.now() * 0.001;
                        objectfunchuan.position.y=Math.sin(time)*4+4;
                        event.preventDefault();
                        break;
                    case 68:
                        objectfunchuan.position.x-=10;
                        camera.position.x-=10;
                        event.preventDefault();
                        break;
                    case 83:
                        objectfunchuan.position.z-=20;
                        camera.position.z-=20;
                        event.preventDefault();
                        break;
                }
            }, false);

            scene.add( objectfunchuan );
            render();
        }, onProgress, onError );
    });
    function animate() {
        requestAnimationFrame( animate );
        render();
    }
    function render() {
        var time = performance.now() * 0.001;//��ȡʱ��
        water.material.uniforms.time.value += 1.0 / 60.0;//������ñ仯һ�Σ�ÿ�仯һ�Σ�  water.render();��Ⱦһ�Σ�
        controls.update();                                //ʵ���ϵײ���һ����̬�������ʵĹ��̡�
        water.render();

        renderer.render( scene, camera );
    }