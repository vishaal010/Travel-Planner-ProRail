import { Activity } from "../../../app/models/activity";

interface Props {
    activities: Activity[];
}
export default function ActivityDashboard({activities}: Props) {
    return (
        <ul className="grid grid-cols-3 gap-4">
            {activities.map((activity) => (
                <li className="text-sm text-gray-700 shadow p-4" key={activity.id}>
                    {activity.title}
                </li>
            ))}
        </ul>
    );
}

