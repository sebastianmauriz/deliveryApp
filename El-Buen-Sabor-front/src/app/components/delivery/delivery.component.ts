import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  usuarioId: any;
  Pedidos: Pedido[] = [];
  pedido: Pedido = new Pedido();
  mostrar: number = 1;
  estado!: String;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private pedidoService: PedidoService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.listarPedido();
  }

  listarPedido() {
    /*
    this.pedidoService.listar().subscribe(pedido => {
      this.Pedidos = pedido as Pedido[];
    });
    */
    //trae filtrado desde el back
    this.pedidoService.getPedidosByEstado(3).subscribe(pedido => {
      this.Pedidos = pedido as Pedido[];
    });

  }

  volver() {
    this.location.back();
  }

  tomarpedido(pedido: Pedido) {
    if (pedido.tipoEnvio === 4) {
      let currentUrl = this.router.url;
      pedido.tipoEnvio = 5;
      this.pedidoService.editar(pedido).subscribe(pedido => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      })
    }
  }

  cambiarEstado(pedido: Pedido, estado: number) {
    let currentUrl = this.router.url;
    pedido.estado = estado;
    this.pedidoService.editar(pedido).subscribe(pedido => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    })
  }

}
