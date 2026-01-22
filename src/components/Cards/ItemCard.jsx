import "./ItemCard.css";

const ItemCard = ({ item, onEdit, onDelete, onDuplicate }) => {
  return (
    <div className="dish-card">
      <div className="dish-actions">
        <button onClick={onEdit}>✏️</button>
        <button onClick={onDelete}>❌</button>
        <button onClick={onDuplicate}>📑</button>
      </div>
      <div className="dish-header">
        <div className="dish-title">
          <strong>{item.name}</strong>
          <span className="dish-price">
            ${Number(item.price || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {!item.available && <span className="dish-badge danger">86’d</span>}
      {!item.visible && <span className="dish-badge muted">Hidden</span>}

      {item.description && (
        <p className="dish-description">{item.description}</p>
      )}

      {item.image && (
        <img src={item.image} alt={item.name} className="dish-image" />
      )}

      {item.modifiers?.length > 0 && (
        <ul className="dish-modifiers">
          {item.modifiers.map((m) => (
            <li key={m.id}>
              {m.name}
              {m.price > 0 && (
                <span className="modifier-price">
                  {" "}
                  (+${Number(m.price).toFixed(2)})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {item.customProperties?.length > 0 && (
        <ul className="dish-properties">
          {item.customProperties.map((p, idx) => (
            <li key={idx}>
              <strong>{p.key}:</strong> {p.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemCard;
