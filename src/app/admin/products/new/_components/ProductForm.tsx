"use client";

import {useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {formatCurrency} from "@/lib/formatters";
import {Button} from "@/components/ui/button";
import {addProduct, updateProduct} from "@/app/admin/_actions/products";
import {useFormState, useFormStatus} from "react-dom";
import {Product} from "@prisma/client";
import Image from "next/image";

export function ProductForm({product}: {product?: Product | null}) {
	const [error, action] = useFormState(
		product ? updateProduct.bind(null, product.id) : addProduct,
		{},
	);
	const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents);
	return (
		<form className="space-y-8" action={action}>
			<div className="space-y-2">
				<Label htmlFor="name">Name</Label>
				<Input type="text" id="name" name="name" required defaultValue={product?.name} />
				{error.name && <div className="text-destructive text-red-600">{error.name}</div>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="priceInCents">Price In Cents</Label>
				<Input
					type="text"
					id="priceInCents"
					name="priceInCents"
					required
					value={priceInCents}
					defaultValue={product?.priceInCents}
					onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
				/>
				{error.priceInCents && (
					<div className="text-destructive text-red-600">{error.priceInCents}</div>
				)}
				<div className="text-muted-foreground">{formatCurrency((priceInCents || 0) / 100)}</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					required
					defaultValue={product?.description}
				/>
				{error.description && (
					<div className="text-destructive text-red-600">{error.description}</div>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="file">File</Label>
				<Input type="file" id="file" name="file" required={product == null} />
				{product != null && <div className="text-muted-foreground">{product.filePath}</div>}
				{error.file && <div className="text-destructive text-red-600">{error.file}</div>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="image">Image</Label>
				<Input type="file" id="image" name="image" required={product == null} />
				{product != null && (
					<Image src={product.imagePath} height={400} width={400} alt="Product Image" />
				)}
				{error.image && <div className="text-destructive text-red-600">{error.image}</div>}
			</div>
			<SubmitButton />
		</form>
	);
}

function SubmitButton() {
	const {pending} = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Saving..." : "Save"}
		</Button>
	);
}
