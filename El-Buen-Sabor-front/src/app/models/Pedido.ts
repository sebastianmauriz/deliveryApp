import { Base } from "./Base";
import { Cliente } from "./Cliente";
import { DetallePedido } from "./DetallePedido";
import { Domicilio } from "./Domicilio";
import { Factura } from "./Factura";
import { MercadopagoDatos } from "./MercadopagoDatos";


export class Pedido implements Base{
    id!: number;
    fecha!: Date;
    numero!: number;
    estado!: number;
    horaEstimadaFin!: Date;
    tipoEnvio!: number;
    total!: number;
    detallePedido: DetallePedido[] = [];
    domicilio!: Domicilio;
    mercadopagoDatos!: MercadopagoDatos;
    factura!: Factura;
    fechaBaja!: Date;
    cliente!: Cliente;
}