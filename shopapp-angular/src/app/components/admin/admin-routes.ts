import { AdminComponent } from "./admin.component";
import { OrderAdminComponent } from "./order/order.admin.component";
import { OrderDetailAdminComponent } from "./order-detail/order.detail.admin.component";
import { Route, Router,Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductAdminComponent } from "./product/product.admin.component";
// import { CategoryAdminComponent } from "./category/category.admin.component";
import { UpdateProductAdminComponent } from "./product/update/update.product.admin.component";
// import { InsertProductAdminComponent } from "./product/insert/insert.product.admin.component";
// import { InsertCategoryAdminComponent } from "./category/insert/insert.category.admin.component";
// import { UpdateCategoryAdminComponent } from "./category/update/update.category.admin.component";

export const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'orders',
                loadComponent: () =>
                import('./order/order.admin.component').then(m => m.OrderAdminComponent)
            },            
            {
                path: 'products',
                component: ProductAdminComponent
            },
            // {
            //     path: 'categories',
            //     component: CategoryAdminComponent
            // },
            // //sub path
            {
                path: 'orders/:id',
                component: OrderDetailAdminComponent
            },
            {
                path: 'products/update/:id',
                loadComponent: () =>
                import('./product/update/update.product.admin.component').then(m => m.UpdateProductAdminComponent)
            },
            // {
            //     path: 'products/insert',
            //     component: InsertProductAdminComponent
            // },
            // //categories            
            // {
            //     path: 'categories/update/:id',
            //     component: UpdateCategoryAdminComponent
            // },
            // {
            //     path: 'categories/insert',
            //     component: InsertCategoryAdminComponent
            // },
        ]
    }
];
/*
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
*/
