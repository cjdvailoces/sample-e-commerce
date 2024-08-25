import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import db from "@/db/db";
import {formatCurrency, formatNumber} from "@/lib/formatters";

async function getSalesData() {
	const data = await db.order.aggregate({_sum: {pricePaidInCents: true}, _count: true});
	// await wait(2000);
	return {
		amount: (data._sum?.pricePaidInCents ?? 0) / 100,
		numberOfSales: data._count,
	};
}

export function wait(duration: number) {
	return new Promise((resolve) => setTimeout(resolve, duration));
}

async function getUserData() {
	const [userCount, orderData] = await Promise.all([
		db.user.count(),
		db.order.aggregate({
			_sum: {pricePaidInCents: true},
		}),
	]);

	return {
		userCount,
		averageValuePerUser:
			userCount > 0 ? (orderData._sum?.pricePaidInCents ?? 0) / userCount / 100 : 0,
	};
}

async function getProductData() {
	const [activeCount, inactiveCount] = await Promise.all([
		db.product.count({where: {isAvailableForPurchase: true}}),
		db.product.count({where: {isAvailableForPurchase: false}}),
	]);

	return {
		activeCount,
		inactiveCount,
	};
}

export default async function AdminDashboard() {
	const [userData, salesData, productData] = await Promise.all([
		getUserData(),
		getSalesData(),
		getProductData(),
	]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<DashboardCard
				title="Sales"
				subtitle={`${formatNumber(salesData.numberOfSales)} orders`}
				body={formatCurrency(salesData.amount)}
			/>
			<DashboardCard
				title="Customer"
				subtitle={`${formatNumber(userData.averageValuePerUser)} ave. value`}
				body={formatCurrency(userData.userCount)}
			/>
			<DashboardCard
				title="Products"
				subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
				body={formatNumber(productData.activeCount)}
			/>
		</div>
	);
}

type DashboardCardProps = {
	title: string;
	subtitle: string;
	body: string;
};

function DashboardCard({title, subtitle, body}: DashboardCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{subtitle}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{body}</p>
			</CardContent>
		</Card>
	);
}