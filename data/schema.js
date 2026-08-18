export const DB_SCHEMA = {
  owners: { id: 'ownerId', fields: ['name', 'phone', 'email', 'role', 'createdAt', 'updatedAt'] },
  clients: { id: 'clientId', unique: ['email', 'phone'], fields: ['name', 'phone', 'email', 'notes', 'createdAt', 'updatedAt'] },
  reviews: { id: 'reviewId', unique: ['clientId'], fields: ['clientId', 'rating', 'review', 'status', 'createdAt', 'updatedAt'] }
};

export const normalizePhone = (value = '') => value.replace(/[^0-9+]/g, '').replace(/^0+(?=27)/, '+');
export const normalizeEmail = (value = '') => value.trim().toLowerCase();

export function dedupeClients(clients = []) {
  const byKey = new Map();
  for (const client of clients) {
    const key = normalizeEmail(client.email) || normalizePhone(client.phone) || client.clientId;
    if (key && !byKey.has(key)) byKey.set(key, client);
  }
  return [...byKey.values()];
}

export const canSubmitReview = (reviews = [], clientId) =>
  !reviews.some(review => review.clientId === clientId && review.status !== 'rejected');
