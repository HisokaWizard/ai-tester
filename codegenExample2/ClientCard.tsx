import React, { useState } from 'react';
import { useGetCustomerQuery, useUpdateCustomerMutation, useCreateCustomerMutation } from './customerApi';
import type { Customer, CustomerUpdate } from './customerApi';

type CustomerCardProps = {
  customerId?: string;
  onClose?: () => void;
};

export const CustomerCard: React.FC<CustomerCardProps> = ({ customerId, onClose }) => {
  const { data: customer, isLoading, error } = useGetCustomerQuery(customerId!, { skip: !customerId });
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<CustomerUpdate>({});
  const [addingInteraction, setAddingInteraction] = useState(false);
  const [newInteraction, setNewInteraction] = useState({ type: '', author: '', summary: '' });

  if (isLoading) return <div className="customer-card">Загрузка...</div>;
  if (error) return <div className="customer-card">Ошибка загрузки данных</div>;

  const handleEdit = () => setEditing(true);
  const handleSaveEdit = async () => {
    if (customerId) {
      await updateCustomer({ id: customerId, ...editData }).unwrap();
      setEditing(false);
    }
  };
  const handleCancelEdit = () => {
    setEditing(false);
    setEditData({});
  };

  const handleAddInteraction = () => setAddingInteraction(true);
  const handleSaveInteraction = async () => {
    if (customer && customer.interactionLog) {
      const updatedLog = [...customer.interactionLog, { ...newInteraction, id: Date.now().toString(), date: new Date().toISOString() }];
      await updateCustomer({ id: customerId!, interactionLog: updatedLog }).unwrap();
      setAddingInteraction(false);
      setNewInteraction({ type: '', author: '', summary: '' });
    }
  };
  const handleCancelInteraction = () => {
    setAddingInteraction(false);
    setNewInteraction({ type: '', author: '', summary: '' });
  };

  const handleClose = () => onClose?.();

  if (!customerId) {
    const handleCreate = async () => {
      try {
        const newCustomer = await createCustomer({ name: 'Новый клиент', legalName: 'Новое ООО', taxId: '1234567890' }).unwrap();
        // Redirect or something
      } catch {}
    };
    return (
      <div className="customer-card">
        <h2>Создать новую карточку</h2>
        <button className="customer-card__button" onClick={handleCreate}>Создать</button>
      </div>
    );
  }

  return (
    <div className="customer-card">
      <div className="customer-card__header">
        <h1 className="customer-card__title">{customer?.name}</h1>
        <span className={`customer-card__status customer-card__status--${customer?.status?.toLowerCase()}`}>{customer?.status}</span>
      </div>

      <div className="customer-card__section">
        <h3 className="customer-card__section-title">Основная информация</h3>
        <div className="customer-card__grid">
          <div>
            <label className="customer-card__label">Юридическое название</label>
            <p className="customer-card__value">{editing ? <input value={editData.name || customer?.legalName} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /> : customer?.legalName}</p>
          </div>
          <div>
            <label className="customer-card__label">ИНН</label>
            <p className="customer-card__value">{customer?.taxId}</p>
          </div>
          <div>
            <label className="customer-card__label">Отрасль</label>
            <p className="customer-card__value">{editing ? <input value={editData.industry || customer?.industry} onChange={(e) => setEditData({ ...editData, industry: e.target.value })} /> : customer?.industry}</p>
          </div>
          <div>
            <label className="customer-card__label">Адрес</label>
            <p className="customer-card__value">{customer?.address?.street}, {customer?.address?.city}</p>
          </div>
        </div>
      </div>

      <div className="customer-card__section">
        <h3 className="customer-card__section-title">Контакты</h3>
        <ul>
          {customer?.contacts?.map((contact) => (
            <li key={contact.id}>
              {contact.firstName} {contact.lastName} - {contact.role} ({contact.email})
            </li>
          ))}
        </ul>
      </div>

      <div className="customer-card__section">
        <h3 className="customer-card__section-title">Статистика</h3>
        <div className="customer-card__grid">
          <div>
            <label className="customer-card__label">Общая стоимость контрактов</label>
            <p className="customer-card__value">{customer?.statistics?.totalContractValue} руб.</p>
          </div>
          <div>
            <label className="customer-card__label">Активных контрактов</label>
            <p className="customer-card__value">{customer?.statistics?.activeContractsCount}</p>
          </div>
        </div>
      </div>

      <div className="customer-card__section">
        <h3 className="customer-card__section-title">Взаимодействия</h3>
        {customer?.interactionLog?.map((interaction) => (
          <div key={interaction.id} className="customer-card__interaction">
            <div className="customer-card__interaction-header">
              <span className="customer-card__interaction-type">{interaction.type}</span>
              <span className="customer-card__interaction-date">{new Date(interaction.date).toLocaleString()}</span>
            </div>
            <p className="customer-card__interaction-author">Автор: {interaction.author}</p>
            <p className="customer-card__interaction-summary">{interaction.summary}</p>
          </div>
        ))}
        {addingInteraction && (
          <div className="customer-card__interaction">
            <input placeholder="Тип" value={newInteraction.type} onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })} />
            <input placeholder="Автор" value={newInteraction.author} onChange={(e) => setNewInteraction({ ...newInteraction, author: e.target.value })} />
            <textarea placeholder="Описание" value={newInteraction.summary} onChange={(e) => setNewInteraction({ ...newInteraction, summary: e.target.value })} />
            <button onClick={handleSaveInteraction}>Сохранить</button>
            <button onClick={handleCancelInteraction}>Отмена</button>
          </div>
        )}
      </div>

      <div className="customer-card__section">
        {!editing ? (
          <button className="customer-card__button" onClick={handleEdit}>Редактировать</button>
        ) : (
          <>
            <button className="customer-card__button" onClick={handleSaveEdit}>Сохранить</button>
            <button className="customer-card__button" onClick={handleCancelEdit}>Отмена</button>
          </>
        )}
        <button className="customer-card__button" onClick={handleAddInteraction}>Добавить взаимодействие</button>
        <button className="customer-card__button" onClick={handleClose}>Закрыть</button>
      </div>
    </div>
  );
};