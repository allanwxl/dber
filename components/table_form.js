import { useState, useEffect } from 'react';
import {
    Button,
    Space,
    Input,
    Card,
    Popconfirm,
    Form,
    Checkbox,
    Select,
} from '@arco-design/web-react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import fieldTypes from '../data/filed_typs';

/**
 * It takes the current fields array, checks if the current index is less than the length of the array,
 * and if so, swaps the current index with the next index
 * @param props - The props passed to the component
 * @param ref - This is a reference to the form element.
 * @returns A React component
 */
function TableFormItem(props) {
    /**
     * If the index of the current field is greater than 0, then swap the current field with the field
     * above it
     */
    const moveUp = () => {
        props.setFields(fields => {
            if (props.index > 0) {
                const _fields = [...fields];
                [_fields[props.index], _fields[props.index - 1]] = [
                    _fields[props.index - 1],
                    _fields[props.index],
                ];
                return _fields;
            }
            return fields;
        });
    };

    /**
     * It takes the current fields array, checks if the current index is less than the length of the
     * array, and if so, swaps the current index with the next index
     */
    const moveDown = () => {
        props.setFields(fields => {
            if (props.index < fields.length - 1) {
                const _fields = [...fields];
                [_fields[props.index], _fields[props.index + 1]] = [
                    _fields[props.index + 1],
                    _fields[props.index],
                ];
                return _fields;
            }
            return fields;
        });
    };

    const { field } = props;
    const index = `A${props.index}`;

    return (
        <Card
            className={classNames({
                dropping:
                    props.draggingId &&
                    props.droppingId === props.field.id &&
                    props.droppingId !== props.draggingId &&
                    props.index !== props.draggingIndex - 1,
                dragging:
                    props.draggingId && props.draggingId === props.field.id,
                'table-form': true,
            })}
            draggable="true"
            onDragStart={() => {
                props.onDragStart(props.field.id);
            }}
            onDragEnd={() => {
                props.setDraggingId(null);
                props.setDroppingId(null);
            }}
            onDragOver={e => {
                props.setDroppingId(props.field.id);
                e.preventDefault();
            }}
            onDrop={e => {
                props.onDrop(props.field.id);
            }}
        >
            <Form.Item hidden field={`${index}.id`} initialValue={field.id}>
                <Input />
            </Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space className="table-form-item">
                    <Form.Item
                        label="Name"
                        field={`${index}.name`}
                        initialValue={field.name}
                        rules={[
                            {
                                required: true,
                                message: 'Please enter field name',
                            },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>
                    <Form.Item
                        label="Type"
                        field={`${index}.type`}
                        initialValue={field.type}
                        rules={[
                            {
                                required: true,
                                message: 'Please choose field type',
                            },
                        ]}
                    >
                        <Select style={{ width: '100%' }} allowCreate>
                            {fieldTypes.map(item => (
                                <Select.Option key={item} value={item}>
                                    {item}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Space>
                <Space className="table-form-item">
                    <Form.Item
                        label="Comment"
                        field={`${index}.note`}
                        initialValue={field.note || ''}
                    >
                        <Input allowClear placeholder="note" />
                    </Form.Item>
                    <Form.Item
                        label="Default"
                        field={`${index}.dbdefault`}
                        initialValue={field.dbdefault || ''}
                    >
                        <Input allowClear placeholder="default" />
                    </Form.Item>
                </Space>
                <Space className="table-form-item">
                    <Form.Item
                        noStyle
                        field={`${index}.pk`}
                        initialValue={field.pk}
                    >
                        <Checkbox defaultChecked={field.pk}>Primary</Checkbox>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        field={`${index}.unique`}
                        initialValue={field.unique}
                    >
                        <Checkbox defaultChecked={field.unique}>
                            Unique
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        field={`${index}.not_null`}
                        initialValue={field.not_null}
                    >
                        <Checkbox defaultChecked={field.not_null}>
                            Not Null
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        field={`${index}.increment`}
                        initialValue={field.increment}
                    >
                        <Checkbox defaultChecked={field.increment}>
                            Increment
                        </Checkbox>
                    </Form.Item>
                </Space>

                <Space className="table-form-item">
                    <Button onClick={moveUp} type="primary" size="small" long>
                        ↑ Move up
                    </Button>
                    <Button onClick={moveDown} type="primary" size="small" long>
                        ↓ Move down
                    </Button>

                    <Popconfirm
                        title="Are you sure delete this field?"
                        onOk={() => {
                            props.removeItem(props.field.id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button status="danger" size="small" long>
                            Remove field
                        </Button>
                    </Popconfirm>
                    <Button
                        onClick={() => props.addItem(props.index)}
                        type="outline"
                        status="success"
                        size="small"
                        long
                    >
                        + Add field after
                    </Button>
                </Space>
            </Space>
        </Card>
    );
}

/* A forwardRef function that is used to forward the ref to the child component. */
// const TableRefFormItem = forwardRef(TableFormItem);

/**
 * It renders a form for editing a table
 * @param props - The props passed to the component.
 * @returns A TableForm component
 */
export default function TableForm(props) {
    const [fields, setFields] = useState(props.table.fields);
    const [name, setName] = useState(props.table.name);
    const [note, setNote] = useState(props.table.note);
    const [form] = Form.useForm();

    useEffect(() => {
        setFields(props.table.fields);
    }, [props.table]);

    const save = values => {
        const table = {
            ...props.table,
            name,
            note,
            fields: Object.values(values),
        };
        delete table.x;
        delete table.y;

        props.updateTable(table);
        props.setCommitting(false);
    };

    useEffect(() => {
        if (props.committing) {
            form.submit();
        }
    }, [props.committing]);

    const addItem = index => {
        const newState = [...fields];
        newState.splice(index + 1, 0, {
            id: nanoid(),
            name: 'new item' + newState.length,
            type: '',
            unique: false,
        });
        setFields(newState);
    };

    const removeItem = id => {
        setFields(state => {
            const fields = state.filter(item => item.id !== id);
            return fields.length ? fields : [];
        });
    };

    // Drag and drop
    const [draggingId, setDraggingId] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(false);
    const [droppingId, setDroppingId] = useState(false);

    const onDragStart = id => {
        setDraggingId(id);
        setDraggingIndex(fields.findIndex(item => item.id === id));
    };

    const onDrop = id => {
        setDroppingId(null);
        const index = fields.findIndex(item => item.id === id);
        const draggingIndex = fields.findIndex(item => item.id === draggingId);

        if (index === draggingIndex) {
            return setDraggingId(null);
        }

        if (index === draggingIndex - 1) {
            setFields(state => {
                const fields = [...state];
                [fields[draggingIndex], fields[draggingIndex - 1]] = [
                    fields[draggingIndex - 1],
                    fields[draggingIndex],
                ];
                return fields;
            });
        } else {
            setFields(state => {
                const _fields = [...state];
                const draggingFiled = _fields.splice(draggingIndex, 1)[0];
                const index = _fields.findIndex(item => item.id === id);

                if (index + 1 < _fields.length) {
                    _fields.splice(index + 1, 0, draggingFiled);
                } else {
                    _fields.push(draggingFiled);
                }

                return _fields;
            });
        }

        setDraggingId(null);
    };

    const unShiftFields = () => {
        const draggingIndex = fields.findIndex(item => item.id === draggingId);
        setFields(state => {
            const _fields = [...state];
            const field = _fields.splice(draggingIndex, 1);
            _fields.unshift(...field);
            return _fields;
        });
        setDraggingId(null);
        setDroppingId(null);
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <div
                className={droppingId === 'root' ? 'dropping' : ''}
                onDragOver={e => {
                    if (draggingIndex !== 0) setDroppingId('root');
                    e.preventDefault();
                }}
                onDrop={e => {
                    unShiftFields();
                }}
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <label>Table Name:</label>
                <Input
                    defaultValue={props.table.name}
                    type="text"
                    onChange={value => {
                        setName(value);
                    }}
                    style={{ width: 200, margin: '0 8px' }}
                />
                <Popconfirm
                    position="br"
                    title="Are you sure you want to delete this table?"
                    okText="Yes"
                    cancelText="No"
                    onOk={() => {
                        props.removeTable(props.table.id);
                    }}
                >
                    <Button type="outline" status="warning">
                        Delete table
                    </Button>
                </Popconfirm>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label>Table Comment:</label>
                <Input
                    defaultValue={props.table.note}
                    type="text"
                    onChange={value => setNote(value)}
                    style={{ width: 460, marginLeft: 8 }}
                />
            </div>

            <Form
                onSubmit={save}
                onSubmitFailed={() => {
                    props.setCommitting(false);
                }}
                form={form}
                labelAlign="left"
                requiredSymbol={false}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onValuesChange={(changedValues, allValues) => {
                    if (!props.formChange) props.setFormChange(true);
                }}
                scrollToFirstError
            >
                {fields.map((field, index) => (
                    <TableFormItem
                        field={field}
                        key={field.id}
                        index={index}
                        addItem={addItem}
                        removeItem={removeItem}
                        setFields={setFields}
                        onDragStart={onDragStart}
                        onDrop={onDrop}
                        draggingIndex={draggingIndex}
                        draggingId={draggingId}
                        droppingId={droppingId}
                        setDroppingId={setDroppingId}
                        setDraggingId={setDraggingId}
                    />
                ))}
                {fields.length === 0 && (
                    <Button
                        onClick={() => addItem(0)}
                        type="outline"
                        status="success"
                        size="small"
                        long
                    >
                        + Add field
                    </Button>
                )}
            </Form>
        </Space>
    );
}
