Este repositorio se creo recien con la plantilla blank de Expo. No generes nada de codigo aun, por ahora que sea planeacion, y definicion de que librerias usar nativas o no, que cambiaria para hacerse mas facil a la ejecucion dado que la aplicacion almacenara todo localmente, como se simularia el envio para hacer factible la demostracion del proyecto (Si deberia tener una fecha ficticia, o tiempos de envio imposiblemente cortos para un caso real). Planeo que sea un proyecto con React Native para exportar a celular que siga las respuestas siguientes:
¿Que problema resuelve la app?
Pone el realizar ordenes de el lado de el vendedor, la fecha de entrega esperada, y la visualizacion de donde va el paquete en una app.

¿Quien es el usuario?
Vendedores de productos que envian sus productos junto con tracking y entrega esperada.

Tiene que cumplir con:
- Tener APIs preferiblemente nativas de Expo para acceso a Camara, Mapas, y Subida de archivos
- Hacerse con React Native Paper
- Tener botones en la parte inferior para moverse entre las vistas de Productos, Pedidos, y Mapa. El progreso en la pantalla de llenado de detalles del pedido esta contenido en la vista de Producto y no se pierde el progreso al cambiarla a medio llenar. La vista de Mapa no muestra ningun pedido hasta que se haya seleccionado en la vista de Pedidos

Como funcionaran las pantallas hasta ahora:
- Primera pantalla donde el vendedor puede crear un producto con nombre, descripcion, y fotos agregadas desde los archivos del sistema o tomadas con la camara. Primero se crea el producto y luego se puede realizar un pedido.
- Pantalla donde se llenen los datos del pedido sobre el producto, y donde se va a enviar en formato que pueda leerse en mapas, utilizar expresiones regulares. Al llenar y confirmar se agregara a una pantalla que liste los pedidos.
- Pantalla que tenga listados los pedidos activos que no han llegado al destino. Presionar uno lleva a la vista del mapa con el rastreo del pedido.
- Pantalla donde se pueda ver el punto donde va un envio en el mapa. Como no es un envio real en este caso, se mueve a nodos cercanos (como ciudades) antes de llegar al destino en la fecha y tiempo esperados envez de moverse linealmente.
