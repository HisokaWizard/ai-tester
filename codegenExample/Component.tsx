import React, { useState, useEffect } from 'react';
import { useGetCustomerQuery, useUpdateCustomerMutation, useCreateCustomerMutation, useGetCustomersQuery } from './customerApi';
import { Customer } from './types';

const CustomerCard: React.FC<{ customerId?: string }> = ({ customerId }) => {
  const { data: customer, isLoading, error } = useGetCustomerQuery(customerId || '', { skip: !customerId });
  const [editMode, setEditMode] = useState(false);
  const [localCustomer, setLocalCustomer] = useState<Customer | null>(null);
  const [updateCustomer] = useUpdateCustomerMutation();
  const [createCustomer] = useCreateCustomerMutation();
  const { data: customersList } = useGetCustomersQuery({ page: 1, limit: 10 });

  useEffect(() => {
    if (customer) {
      setLocalCustomer(customer);
    }
  }, [customer]);

  if (isLoading) return <div className="customer-card__loading">Загрузка...</div>;
  if (error) return <div className="customer-card__error">Ошибка загрузки</div>;

  const handleSave = async () => {
    if (customerId) {
      await updateCustomer({ id: customerId, data: localCustomer! }).unwrap();
    } else {
      await createCustomer(localCustomer!).unwrap();
    }
    setEditMode(false);
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (customer) setLocalCustomer(customer);
  };

  if (!customerId && !customer) {
    return (
      <div className="customer-card">
        <h2>Создать новую карточку</h2>
        {/* Форма создания */}
        <button onClick={handleSave} className="customer-card__button">Создать</button>
      </div>
    );
  }

  return (
    <div className="customer-card">
      <div className="customer-card__header">
        <h1 className="customer-card__title">{localCustomer?.name}</h1>
        <span className={`customer-card__status customer-card__status--${localCustomer?.status?.toLowerCase()}`}>
          {localCustomer?.status}
        </span>
      </div>

      <div className="customer-card__section">
        <h3 className="customer-card__section-title">Основная информация</h3>
        <div className="customer-card__grid">
          <div>
            <label className="customer-card__label">Юридическое название</label>
            <p className="customer-card__value">
              {editMode ? (
                <input
                  value={localCustomer?.legalName || ''}
                  onChange={(e) => setLocalCustomer({ ...localCustomer!, legalName: e.target.value })}
                />
              ) : (
                localCustomer?.legalName
              )}
            </p>
          </div>
          <div>
            <label className="customer-card__label">ИНН</label>
            <p className="customer-card__value">{localCustomer?.taxId}</p>
          </div>
          {/* Другие поля */}
        </div>
      </div>

      <div className="customer-card__section">
        <h3 className="customer-card__section-title">Контакты</h3>
        {localCustomer?.contacts?.map((contact) => (
          <div key={contact.id} className="customer-card__contact">
            <p>{contact.firstName} {contact.lastName} - {contact.role}</p>
            <p>{contact.email}</p>
          </div>
        ))}
      </div>

      <div className="customer-card__section">
        <h3 className="customer-card__section-title">Взаимодействия</h3>
        {localCustomer?.interactionLog?.map((interaction) => (
          <div key={interaction.id} className="customer-card__interaction">
            <div className="customer-card__interaction-header">
              <span className="customer-card__interaction-type">{interaction.type}</span>
              <span className="customer-card__interaction-date">{new Date(interaction.date).toLocaleString()}</span>
            </div>
            <p className="customer-card__interaction-author">Автор: {interaction.author}</p>
            <p className="customer-card__interaction-summary">{interaction.summary}</p>
          </div>
        ))}
        <button className="customer-card__button">Добавить взаимодействие</button>
      </div>

      <div className="customer-card__actions">
        {editMode ? (
          <>
            <button onClick={handleSave} className="customer-card__button">Сохранить</button>
            <button onClick={handleCancel} className="customer-card__button">Отмена</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="customer-card__button">Редактировать</button>
            <button className="customer-card__button">Закрыть</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;

export type { Customer } from './types';