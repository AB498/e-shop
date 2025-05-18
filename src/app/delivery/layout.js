import { metadata } from './metadata';

export { metadata };

export default function DeliveryLayout({ children }) {
  return (
    <div className="delivery-layout">
      {children}
    </div>
  );
}
