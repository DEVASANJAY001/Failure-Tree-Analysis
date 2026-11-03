import { NextRequest, NextResponse } from 'next/server';
import { WorkOrder } from '@/lib/types';
import { FTA_SCENARIOS } from '@/lib/fta-scenarios';

let inMemoryWorkOrders: WorkOrder[] = FTA_SCENARIOS.map(s => s.defaultWorkOrder);

export async function GET() {
  return NextResponse.json({ workOrders: inMemoryWorkOrders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newWo: WorkOrder = {
      id: 'WO-' + Date.now().toString().slice(-6),
      status: 'Draft',
      description: body.description || 'Laser align and re-route butyl bead',
      equipment: body.equipment || 'Vehicle #8XF-90214',
      plant: body.plant || 'Plant 1 · Service Bay',
      priority: body.priority || 'High',
      assignedTo: body.assignedTo || 'Nikit (Techline Specialist)',
      dueDate: body.dueDate || new Date().toISOString().slice(0, 10),
      estimatedHours: body.estimatedHours || '1.5',
    };

    inMemoryWorkOrders.unshift(newWo);
    return NextResponse.json({ success: true, workOrder: newWo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const wo = inMemoryWorkOrders.find(w => w.id === id);
    if (!wo) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }
    wo.status = status;
    return NextResponse.json({ success: true, workOrder: wo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

