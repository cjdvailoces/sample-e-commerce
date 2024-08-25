import {PageHeader} from "../../_components/PageHeader";
import {ProductForm} from "./_components/ProductForm";

export default function AdminProductsNew() {
	return (
		<>
			<PageHeader>Add Product</PageHeader>
			<ProductForm />
		</>
	);
}