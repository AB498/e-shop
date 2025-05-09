export const metadata = {
  title: 'Delivery Portal - E-Shop',
  description: 'Delivery portal for E-Shop internal delivery system',
};

export default function DeliveryLayout({ children }) {
  return (
    <div className="delivery-layout">
      {children}
    </div>
  );
}
