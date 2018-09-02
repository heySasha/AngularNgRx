import { Injectable} from '@angular/core';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';


import { Product } from '../product';
import { ProductService } from '../product.service';
import * as productActions from './product.actions';

@Injectable()
export class ProductEffects {

    constructor(
        private productService: ProductService,
        private actions$: Actions) {
    }

    @Effect()
    loadProducts$: Observable<Action> = this.actions$.pipe(
        ofType(productActions.ProductActionTypes.Load),
        mergeMap(action =>
            this.productService.getProducts().pipe(
                map(products => (new productActions.LoadSuccess(products))),
                catchError(err => of(new productActions.LoadFail(err)))
            )
        )
    );

    @Effect()
    updateProduct$: Observable<Action> = this.actions$.pipe(
        ofType(productActions.ProductActionTypes.UpdateProduct),
        map((action: productActions.UpdateProduct) => action.payload),
        mergeMap((product: Product) =>
            this.productService.updateProduct(product).pipe(
                map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
                catchError(err => of(new productActions.UpdateProductFail(err)))
            )
        )
    );
}
