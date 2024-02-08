export default function SpinnerGIF({ style }) {
  return (
    <svg {...style} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <rect x="10" y="10" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="30" y="10" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.08333333333333333s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="50" y="10" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.16666666666666666s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="70" y="10" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.25s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="10" y="30" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.9166666666666666s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="70" y="30" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.3333333333333333s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="10" y="50" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.8333333333333334s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="70" y="50" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.4166666666666667s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="10" y="70" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.75s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="30" y="70" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.6666666666666666s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="50" y="70" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.5833333333333334s"
          calcMode="discrete"
        ></animate>
      </rect>
      <rect x="70" y="70" width="20" height="20" fill="#0061fe">
        <animate
          attributeName="fill"
          values="#ffffff;#0061fe;#0061fe"
          keyTimes="0;0.08333333333333333;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.5s"
          calcMode="discrete"
        ></animate>
      </rect>
    </svg>
  );
}
