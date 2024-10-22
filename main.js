document.addEventListener('DOMContentLoaded', () => {

    let totalIngresos = 0;
    let totalEgresos = 0;

    function ValoresPorDefecto() {
        const hoy = new Date().toISOString().split('T')[0];
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            fechaInput.value = hoy;
        }
    }

    function ValoresPorDefecto() {
        const hoy = new Date().toISOString().split('T')[0];
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            fechaInput.value = hoy;
        }
    }

    function limpiarCampos() {
        ValoresPorDefecto();
        const fields = ['cliente', 'detalle', 'cantidadi', 'ingreso', 'cantidade', 'egreso'];
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '0';
        });
    }

    function actualizarTotales() {
        const totalIngresosElem = document.getElementById('totalIngresos');
        const totalEgresosElem = document.getElementById('totalEgresos');
        const totalElem = document.getElementById('total');

        if (totalIngresosElem) totalIngresosElem.textContent = `Total Ingresos: $${formatearNumero(totalIngresos)}`;
        if (totalEgresosElem) totalEgresosElem.textContent = `Total Egresos: $${formatearNumero(totalEgresos)}`;
        if (totalElem) totalElem.textContent = `Total: $${formatearNumero(totalIngresos - totalEgresos)}`;
    }

    document.getElementById('agregaritem')?.addEventListener('click', (event) => {
        event.preventDefault();

        const fecha = document.getElementById('fecha').value;
        const cliente = document.getElementById('cliente').value;
        const detalle = document.getElementById('detalle').value;
        const cantidadi = parseFloat(document.getElementById('cantidadi').value) || 0;
        const ingreso = parseFloat(document.getElementById('ingreso').value) || 0;
        const cantidade = parseFloat(document.getElementById('cantidade').value) || 0;
        const egreso = parseFloat(document.getElementById('egreso').value) || 0;

        if (cantidadi < 0 || cantidade < 0 || ingreso < 0 || egreso < 0) {
            alert("Los valores ingresados NO pueden ser negativos.");
            return;
        }

        if (isNaN(cantidadi) || isNaN(ingreso) || isNaN(cantidade) || isNaN(egreso)) {
            alert("Por favor, ingrese valores numéricos válidos.");
            return;
        }

        const nuevoItem = {
            fecha,
            cliente,
            detalle,
            cantidadi,
            ingreso,
            cantidade,
            egreso,
            subtotal: (cantidadi * ingreso) - (cantidade * egreso)
        };

        totalIngresos += ingreso * cantidadi;
        totalEgresos += egreso * cantidade;

        guardarLocalStorage(nuevoItem);
        agregarAWrow(nuevoItem);
        actualizarTotales();
        limpiarCampos();
    });

    function guardarLocalStorage(item) {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    }

    function agregarAWrow(item) {
        const tableBody = document.getElementById('Tabla')?.getElementsByTagName('tbody')[0];
        if (tableBody) {
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = item.fecha;
            newRow.insertCell(1).textContent = item.cliente;
            newRow.insertCell(2).textContent = item.detalle;
            newRow.insertCell(3).textContent = item.cantidadi;
            newRow.insertCell(4).textContent = `$${formatearNumero(item.ingreso)}`;
            newRow.insertCell(5).textContent = item.cantidade;
            newRow.insertCell(6).textContent = `$${formatearNumero(item.egreso)}`;
            newRow.insertCell(7).textContent = `$${formatearNumero(item.subtotal)}`;
        }
    }

    function cargarReportes() {
        const reportes = JSON.parse(localStorage.getItem('items')) || [];
        const totalesMensuales = {};

        reportes.forEach(item => {
            const fecha = new Date(item.fecha);
            const mes = fecha.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (!totalesMensuales[mes]) {
                totalesMensuales[mes] = { ingreso: 0, egreso: 0 };
            }

            totalesMensuales[mes].ingreso += item.ingreso * item.cantidadi;
            totalesMensuales[mes].egreso += item.egreso * item.cantidade;
        });

        const reportesDiv = document.getElementById('reportes');
        if (reportesDiv) {
            reportesDiv.innerHTML = `
                <h2 class="totalh2">Totales Mensuales</h2>
                <table>
                    <thead>
                        <tr>
                            <th class="th2">Mes</th>
                            <th class="th2">Ingreso Mensual</th>
                            <th class="th2">Egreso Mensual</th>
                            <th class="th2">Saldo Mensual</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${Object.entries(totalesMensuales).map(([mes, totales]) => {
                const saldo = totales.ingreso - totales.egreso;
                return `
                            <tr>
                                <td>${mes}</td>
                                <td>$${formatearNumero(totales.ingreso)}</td>
                                <td>$${formatearNumero(totales.egreso)}</td>
                                <td>$${formatearNumero(saldo)}</td>
                            </tr>
                        `;
            }).join('')}
                    </tbody>
                </table>
            `;
        }
    }

    const estadisticasButton = document.getElementById('estadisticaspage');
    if (estadisticasButton) {
        estadisticasButton.addEventListener('click', () => {
            window.location.href = 'pages/reportes.html';
        });
    }

    function formatearNumero(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    //API Dolar API //

    fetch("https://dolarapi.com/v1/dolares/blue")
  .then(response => response.json())
  .then(data => console.log(data));
  
// JSON //


//********/


    //Probando desde ACA borrar todo el storage //

    function vaciarStorage() {
        localStorage.removeItem('items');
        totalIngresos = 0;
        totalEgresos = 0;
        actualizarTotales();
        const tableBody = document.getElementById('Tabla')?.getElementsByTagName('tbody')[0];
        if (tableBody) {
            tableBody.innerHTML = ''; // Limpiar la tabla
        }
        alert("Datos borrados exitosamente.");
    }

    document.getElementById('limpiar')?.addEventListener('click', vaciarStorage);



    ValoresPorDefecto();
    if (window.location.pathname.includes('pages/reportes.html')) {
        cargarReportes();
    }
});
