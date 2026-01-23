import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import API from "../api";

export default function KanbanBoard({ tickets, refresh }) {
  const columns = {
    Todo: tickets.filter((t) => t.status === "Todo"),
    InProgress: tickets.filter((t) => t.status === "InProgress"),
    Done: tickets.filter((t) => t.status === "Done"),
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const ticketId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await API.put(`/tickets/${ticketId}/status`, { status: newStatus });
    refresh();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, items]) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-800 p-3 rounded min-h-[300px]"
              >
                <h2 className="text-lg font-bold mb-3">{status}</h2>

                {items.map((t, index) => (
                  <Draggable
                    draggableId={t._id}
                    index={index}
                    key={t._id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-gray-700 p-2 rounded mb-2"
                      >
                        <p className="font-semibold">{t.title}</p>
                        <p className="text-xs text-gray-300">
                          {t.description}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
